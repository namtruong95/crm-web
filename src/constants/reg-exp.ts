export const RegExp = {
  email: /^[\w.-]+@[\w.-]+\.[\w]{2,4}$/,
  // phone: /^0[\d]{9,10}$/,
  numberFormat: /(\d)(?=(\d{3})+(?!\d))/g,
  userName: /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/,
};
