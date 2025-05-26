declare namespace DictionaryModule {
  interface Dictionary {
    code: string;
    desc: string;
  }

  interface DictionaryType {
    type: string;
    dictionaries: Dictionary[];
  }
}
