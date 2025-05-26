export abstract class OrderFilter {
  abstract sort: string[];
}

export abstract class Pageable extends OrderFilter {
  abstract pageNumber: number;

  abstract pageSize: number;
}
