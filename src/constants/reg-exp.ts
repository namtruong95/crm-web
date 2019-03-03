export const RegExp = {
  email: /^[\w.-]+@[\w.-]+\.[\w]{2,4}$/,
  // phone: /^0[\d]{9,10}$/,
  numberFormat: /(\d)(?=(\d{3})+(?!\d))/g,
  userName: /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/,
  latitude: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  longitude: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
};
