interface String {
  toNumber(): number;
}

String.prototype.toNumber = function(): number {
  return +this.split(',').join('');
};
