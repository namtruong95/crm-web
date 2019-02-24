enum SORT_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryBuilder {
  private _currentPage = 1;
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(v: number) {
    this._currentPage = v;
  }

  private _size = 5;
  public get size(): number {
    return this._size;
  }
  public set size(v: number) {
    this._size = v;
  }

  public get from(): number {
    return this.totalElements > 0 ? (this.currentPage - 1) * this.size + 1 : 0;
  }

  public get to(): number {
    const to = this.from + this.size - 1;
    return to <= this.totalElements ? to : this.totalElements;
  }

  private _sort: string;
  public get sort(): string {
    return this._sort;
  }
  public set sort(v: string) {
    this._sort = v;
  }

  private _column = 'id';
  public get column(): string {
    return this._column || 'id';
  }
  public set column(v: string) {
    this._column = v;
  }

  private _txtSearch: string;
  public get txtSearch(): string {
    return this._txtSearch;
  }
  public set txtSearch(v: string) {
    this._txtSearch = v;
  }

  private _totalElements: number;
  public get totalElements(): number {
    return this._totalElements || 0;
  }
  public set totalElements(v: number) {
    this._totalElements = v;
  }

  private _totalPages: number;
  public get totalPages(): number {
    return this._totalPages;
  }
  public set totalPages(v: number) {
    this._totalPages = v;
  }

  constructor() {
    this.sort = SORT_TYPE.DESC;
    this.column = '';
    this.txtSearch = '';
  }

  public nextPage(): void {
    this._currentPage++;
  }

  public prevPage(): number {
    return this._currentPage--;
  }

  public setQuery(data: any) {
    this.totalPages = data.totalPages;
    this.size = data.size;
    this.totalElements = data.totalElements;
  }

  public queryJSON() {
    const query: any = {
      page: this.currentPage <= 0 ? 0 : this.currentPage - 1,
      size: this.size,
      sort: this.sort,
      column: this.column,
      txtSearch: this.txtSearch,
    };

    return query;
  }

  public resetQuery() {
    this.currentPage = 1;
    this.size = 5;
    this.txtSearch = '';
    this.column = 'id';
  }
}
