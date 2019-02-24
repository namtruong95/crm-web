interface Number {
  format(): string;
  round(fix: number): number;
}

Number.prototype.format = function(): string {
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

Number.prototype.round = function(fix): number {
  return Math.round(this * fix) / fix;
};
