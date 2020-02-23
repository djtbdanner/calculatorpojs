var Payment = (function() {
  function Payment() {
    this.totalInterest = 0;
    this.beginningBalance = 0;
  }
  Payment.prototype.round = function() {
    this.amount = Math.round(this.amount * 100) / 100;
    this.principal = Math.round(this.principal * 100) / 100;
    this.interest = Math.round(this.interest * 100) / 100;
    this.balance = Math.round(this.balance * 100) / 100;
    this.totalInterest = Math.round(this.totalInterest * 100) / 100;
    this.beginningBalance = Math.round(this.beginningBalance * 100) / 100;
  };
  return Payment;
}());

var PaymentData = (function() {
  function PaymentData() {}
  return PaymentData;
}());

function calculate(loan) {
  var paymentAmount = 0;
  var rate = loan.interest / 100;
  if (loan.interest > 0) {
    var rateC = rate / 12;
    paymentAmount = loan.amount * (rateC / (1 - Math.pow((1 + rateC), -loan.payments)));
  } else {
    paymentAmount = paymentAmount = loan.amount / loan.payments;
  }
  var payments = new Array;
  var totalLoanAmt = loan.amount;
  var totalInterest = 0;
  for (var i = 0; i < loan.payments; i++) {
    var interest = (totalLoanAmt * rate) / 12;
    var principal = paymentAmount - interest;
    var beginningBalance = totalLoanAmt;
    totalInterest = totalInterest + interest;
    totalLoanAmt = totalLoanAmt - principal;
    var payment = new Payment;
    payment.amount = paymentAmount;
    payment.interest = interest;
    payment.totalInterest = totalInterest;
    payment.principal = principal;
    payment.balance = totalLoanAmt;
    payment.beginningBalance = beginningBalance;
    payment.paymentNumber = i + 1;
    payment.round();
    var date = new Date;
    payment.dueDate = addMonthsUTC(loan.startDate, i);
    payments.push(payment);
  }
  var paymentData = new PaymentData;
  paymentData.payments = payments;
  var p = new Payment;
  p.amount = paymentAmount;
  p.interest = totalInterest;
  p.round();
  paymentData.payment = p;
  return paymentData;
};

function addMonthsUTC(date, count) {
  if (date && count) {
    var d = (date = new Date(+date)).getUTCDate();
    date.setUTCMonth(date.getUTCMonth() + count, 1);
    var m = date.getUTCMonth();
    date.setUTCDate(d);
    if (date.getUTCMonth() !== m)
      date.setUTCDate(0);
  }
  return date;
};

function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
}
