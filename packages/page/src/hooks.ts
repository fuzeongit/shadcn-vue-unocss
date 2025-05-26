import type { Ref } from 'vue';
import { computed, onBeforeMount, ref, toRaw, watch } from 'vue';
import type { LocationQuery } from 'vue-router';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { cloneDeep, isEqual } from 'lodash-es';
import type { OrderFilter, Pageable } from './models';

export type RestfulResult<V extends string, T> = {
  [K in V]: T; // 映射类型
};

export type Pagination<V extends string, T> = {
  [K in V]: T[]; // 映射类型
};

type FilterOptions<S> = {
  /**
   * 通过路由参数构建请求参数模型
   *
   * @param searchParams 路由参数
   * @returns
   */
  paramsBuilder: (searchParams: LocationQuery) => S;

  /**
   * 验证参数模型是否合法
   *
   * @param criteria 请求参数模型
   * @returns
   */
  validateParams?: (criteria: S) => Promise<void>;

  /** 是否监听路由 */
  watchRoute: boolean;
};

type PageOptions<
  T,
  S extends Pageable,
  PFields extends string,
  RDFields extends string,
  RR extends RestfulResult<RDFields, Pagination<PFields, T>>
> = {
  /**
   * 构建请求参数
   *
   * @param normalParams 请求参数模型
   * @returns
   */
  fetchParamsBuilder?: (normalParams: S) => any;
  /**
   * 构建请求
   *
   * @param params 请求参数
   * @returns
   */
  fetchBuilder: (params: any) => Promise<RR>;

  /**
   * 构建错误处理
   *
   * @param result 错误返回
   * @returns
   */
  errorBuilder?: (result: RestfulResult<RDFields, unknown>) => void;
  /**
   * 构建列表数据
   *
   * @param pagination 分页数据
   * @returns
   */
  listBuilder?: (pagination: Pagination<PFields, T>) => void;
  /** 字段 */
  fields: {
    resultData: RDFields;
    paginationList: PFields;
  };
  /** 默认页码 */
  defaultPageNumber?: number;
} & FilterOptions<S>;

type ListOptions<T, S extends OrderFilter, RDFields extends string, RR extends RestfulResult<RDFields, T[]>> = {
  /**
   * 构建请求参数
   *
   * @param normalParams 请求参数模型
   * @returns
   */
  fetchParamsBuilder?: (normalParams: S) => any;
  /**
   * 构建请求
   *
   * @param params 请求参数
   * @returns
   */
  fetchBuilder: (params: any) => Promise<RR>;

  /**
   * 构建错误处理
   *
   * @param result 错误返回
   * @returns
   */
  errorBuilder?: (result: RestfulResult<RDFields, unknown>) => void;

  /** 字段 */
  fields: {
    resultData: RDFields;
  };
} & FilterOptions<S>;

export const useRouteParams = <T>(
  { paramsBuilder, validateParams, watchRoute }: FilterOptions<T>,
  fetchData: (_: T) => void
) => {
  const route = useRoute();
  const router = useRouter();

  const routeHandler = async (params: LocationQuery) => {
    await router.push({
      path: route.fullPath,
      query: params
    });
  };

  // 路由参数
  const searchParams = computed(() => {
    if (watchRoute) {
      return route.query;
    }
    return {};
  });

  // 默认参数，从路由获取，不强制刷新页面不改变
  const defaultParams = paramsBuilder(searchParams.value);
  // 标准参数
  const normalParams = ref(defaultParams);

  // 检测路由参数变化
  const watchHandle = watch(
    searchParams,
    newValue => {
      normalParams.value = paramsBuilder(newValue);
      fetchData(normalParams.value);
    },
    {
      deep: true
    }
  );

  onBeforeMount(() => {
    validateParams?.(normalParams.value);
    fetchData(defaultParams);
  });

  // 在离开当前路由的时候摧毁监听
  onBeforeRouteLeave(() => {
    watchHandle();
  });
  return {
    routeHandler,
    defaultParams,
    normalParams
  };
};

export const usePaging = <
  T,
  S extends Pageable,
  PFields extends string,
  RDFields extends string,
  P extends Pagination<PFields, T>,
  RR extends RestfulResult<RDFields, P>
>({
  fetchBuilder,
  fetchParamsBuilder,
  paramsBuilder,
  errorBuilder,
  validateParams,
  listBuilder,
  fields,
  watchRoute = true,
  defaultPageNumber = 0
}: PageOptions<T, S, PFields, RDFields, RR>) => {
  const loading = ref(false);

  const pagination = ref<P>();

  const { routeHandler, defaultParams, normalParams } = useRouteParams(
    {
      paramsBuilder,
      validateParams,
      watchRoute
    },
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    v => paging(v)
  );

  /** 获取数据 */
  const paging = async (params: S) => {
    loading.value = true;
    Object.keys(params).forEach(key => {
      normalParams.value[key] = params[key as keyof S];
    });
    const result = await (async () => {
      return fetchBuilder(fetchParamsBuilder?.(normalParams.value) ?? normalParams.value);
    })().finally(() => {
      loading.value = false;
    });
    errorBuilder?.(result);
    pagination.value = result[fields.resultData];
    listBuilder?.(pagination.value);
  };

  /**
   * 改变搜索条件
   *
   * @param params
   */
  const query = async (params: Partial<S> = {}) => {
    const raw: S = toRaw(normalParams.value);
    const targetParams = {
      ...paramsBuilder({}),
      pageNumber: defaultPageNumber,
      pageSize: raw.pageSize,
      sort: raw.sort
    };
    Object.keys(params).forEach(key => {
      targetParams[key as keyof S] = params[key as keyof S]!;
    });
    if (watchRoute && !isEqual({ ...cloneDeep(targetParams) }, { ...cloneDeep(raw) })) {
      await routeHandler(targetParams as any);
    } else {
      await paging(targetParams);
    }
  };

  /**
   * 改变页码
   *
   * @param pageNumber
   */
  const changePage = async (pageNumber: number) => {
    const sourcePage = normalParams.value.pageNumber;
    const targetParams = { ...normalParams.value, pageNumber };
    if (watchRoute) {
      if (sourcePage === pageNumber) {
        await paging(targetParams);
      } else {
        await routeHandler(targetParams);
      }
    } else {
      await paging(targetParams);
    }
  };

  /**
   * 改变页码分页大小
   *
   * @param pageSize
   */
  const changeLimit = async (pageSize: number) => {
    const targetParams = { ...normalParams.value, pageNumber: defaultPageNumber, pageSize };
    if (watchRoute) {
      await routeHandler(targetParams);
    } else {
      await paging(targetParams);
    }
  };
  /**
   * 改变排序
   *
   * @param sort
   */
  const changeSort = async (sort: string[]) => {
    const targetParams = {
      ...normalParams.value,
      pageNumber: defaultPageNumber,
      sort
    };

    if (watchRoute) {
      await routeHandler(targetParams);
    } else {
      await paging(targetParams);
    }
  };

  /** 重置排序 */
  const resetSort = async () => {
    const targetParams = {
      ...normalParams.value,
      pageNumber: defaultPageNumber,
      sort: paramsBuilder({}).sort
    };
    if (watchRoute) {
      await routeHandler(targetParams);
    } else {
      await paging(targetParams);
    }
  };

  return {
    defaultParams,
    normalParams,
    loading,
    pagination,
    paging,
    query,
    changePage,
    changeLimit,
    changeSort,
    resetSort
  };
};

export const useList = <T, S extends OrderFilter, RDFields extends string, RR extends RestfulResult<RDFields, T[]>>({
  fetchBuilder,
  fetchParamsBuilder,
  paramsBuilder,
  errorBuilder,
  validateParams,
  fields,
  watchRoute = true
}: ListOptions<T, S, RDFields, RR>) => {
  const loading = ref(false);

  const list: Ref<T[]> = ref([]);

  const { routeHandler, defaultParams, normalParams } = useRouteParams(
    {
      paramsBuilder,
      validateParams,
      watchRoute
    },
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    v => listAll(v)
  );

  const listAll = async (params: S) => {
    loading.value = true;
    Object.keys(params).forEach(key => {
      normalParams.value[key] = params[key as keyof S];
    });
    const result = await (async () => {
      return fetchBuilder(fetchParamsBuilder?.(normalParams.value) ?? normalParams.value);
    })().finally(() => {
      loading.value = false;
    });
    errorBuilder?.(result);
    list.value = result[fields.resultData];
  };
  /**
   * 改变搜索条件
   *
   * @param params
   */
  const query = async (params: Partial<S> = {}) => {
    const raw: S = toRaw(normalParams.value);
    const targetParams = {
      ...paramsBuilder({})
    };
    Object.keys(params).forEach(key => {
      targetParams[key as keyof S] = params[key as keyof S]!;
    });
    if (watchRoute && !isEqual({ ...cloneDeep(targetParams) }, { ...cloneDeep(raw) })) {
      await routeHandler(targetParams as any);
    } else {
      await listAll(targetParams);
    }
  };

  /**
   * 改变排序
   *
   * @param sort
   */
  const changeSort = async (sort: string[]) => {
    const targetParams = {
      ...normalParams.value,
      sort
    };

    if (watchRoute) {
      await routeHandler(targetParams);
    } else {
      await listAll(targetParams);
    }
  };

  /** 重置排序 */
  const resetSort = async () => {
    const targetParams = {
      ...normalParams.value,
      sort: paramsBuilder({}).sort
    };
    if (watchRoute) {
      await routeHandler(targetParams);
    } else {
      await listAll(targetParams);
    }
  };

  return {
    defaultParams,
    normalParams,
    loading,
    listAll,
    query,
    changeSort,
    resetSort,
    list
  };
};
