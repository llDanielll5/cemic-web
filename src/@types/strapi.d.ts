interface StrapiPagination {
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
}

interface StrapiRelation<T> {
  data: T;
}

interface StrapiCreateData<T> {
  data: T;
}

interface StrapiListRelation<T> {
  data: T[];
  meta?: StrapiPagination;
}

interface StrapiData<T> {
  id: number;
  attributes: T;
}

type StrapiRelationData<T> = StrapiRelation<StrapiData<T>>;
type StrapiListRelationData<T> = StrapiListRelation<StrapiData<T>>;
