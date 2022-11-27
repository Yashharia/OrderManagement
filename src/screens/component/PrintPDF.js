import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from 'expo-file-system';
export const printPDF = async (single_id, orderData) => {
  var singlerow = ``;
  orderData.goods.map((data, i) => {
    var description = "";
    var descriptionHalf = "";
    data.description.map((item, j) => {
      if (item.value) {
        if (j != 0) {
          description += ", ";
        }
        description += item.value;
      }
    });
    data.descriptionHalf.map((item, j) => {
      if (item.value) {
        if (j != 0) {
          descriptionHalf += ", ";
        }
        descriptionHalf += item.value;
      }
    });
    singlerow += `<tr>
          <td>${data.quality}</td>
          <td><b>Design / Color Full: </b>${description}<br/>
          ${descriptionHalf && `<b>Design / Color Half: </b>${descriptionHalf}`}
          </td>
          <td>${data.rate}</td>
        </tr><tr><td>.</td><td></td><td></td></tr>`;
  });
  var brokerage = (orderData.brokerage)? `<tr><td></td><td><b>Brokerage - </b> ${orderData.brokerage}%</td><td></td></tr>` : '';
  var discount = (orderData.discount)? `<tr><td></td><td><b>Discount - </b> ${orderData.discount}%</td><td></td></tr>` : '';
  var totalQuantity = (orderData.totalQuantity)? `<tr><td></td><td><b>Total Quantity - ${orderData.totalQuantity}</b></td><td></td></tr>` : '';

  var orderDate = orderData.date;

  const html = `
    <style>
    table.GeneratedTable {
      width: 100%;
      background-color: #ffffff;
      border-collapse: collapse;
      border-width: 2px;
      border-color: #000;
      border-style: solid;
      color: #000000;
    }
    
    table.GeneratedTable td, table.GeneratedTable th {
      border-width: 2px;
      border-color: #000;
      border-style: solid;
      padding: 3px;
    }

    table tr{min-height:40px}
    .terms{font-size:8px}
    .address{font-size:10px}
    td{ word-wrap: break-word;}
    </style>
    
    <table style="width: 100%">
        <tr>
            <td style="width: 50%"><b>GST:</b> 27AAEFJ571301ZN</td>
            <td style="width: 50%; text-align:right";><b>Mob:</b> 9321772374<br>8698999322<br><b>Email:</b> jktexs@gmail.com</td>
        </tr>
    </table>
    <div style="text-align:center">
        <h1 style="margin-bottom:10px">J. K. TEXTILES</h1>
        <p class="address">Add.: 145-C, Ground Floor, Room No. 5, Sangam Building, Dr.Viegas Street, Kalbadevi Road, Mumbai 400002.<br/>
        Regd. Off.: 1216, Jai Maharashtra Compound, Narpoli, Bhiwandi - 421 305, Dist. Thane.</p>
    </div>
    <hr/>
    <table style="width: 100%">
        <tr>
            <td style="width: 50%; margin-bottom: 5px"><b>Indent no:</b> ${orderData.orderID}</td>
            <td style="width: 50%; text-align:right"><b>Date:</b> ${orderDate}</td>
        </tr>
    </table>
    <hr/>
    <table style="width: 100%; margin-bottom: 5px">
        <tr>
            <td style="width: 60%;  word-wrap: break-all;">
              <b>Buyer Details:</b> ${orderData.buyerName}<br>
              <b>Buyer Address:</b> ${orderData.buyerAddress}<br>
              <b>Buyer Phone No.:</b> ${orderData.buyerNumber}<br>
              <b>Buyer GST No.:</b> ${orderData.buyerGST}
            </td>
            <td style="width: 40%">
              <b>Transport:</b> ${orderData.transport}<br>
              <b>Broker:</b> ${orderData.broker}<br>
              <b>Broker Number:</b> ${orderData.brokerNumber}
            </td>
        </tr>
    </table>
    <hr/>
    <table style="width: 100%; margin-bottom: 5px">
        <tr>
            <td style="width: 60%">
              <b>Consignee Details:</b> ${orderData.consigneeName}<br>
              <b>Consignee Address:</b> ${orderData.consigneeAddress}<br>
              <b>Consignee Phone No.:</b> ${orderData.consigneeNumber}<br>
              <b>Consignee GST No.:</b> ${orderData.consigneeGST}
            </td>
            <td style="width: 40%">
              <b>Remarks:</b> ${orderData.remarks}<br>
            </td>
        </tr>
    </table> 
    <hr/>
    <br/>

    <table class="GeneratedTable">
      <thead>
        <tr>
          <th>Quality</th>
          <th>Description of Goods</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody>
      ${singlerow}
      ${totalQuantity}
      ${discount}
      ${brokerage}
        <tr>
          <th></th>
          <th>THE RATES ARE ACCORDING TO BHIWANDI DELIVERY</th>
          <th></th>
        </tr>
      </tbody>
    </table>

    <br>
    <p class="terms">
    TERMS & CONDITION :<br/>
      1) Any deduction, i.e. Brokerage, Dalal, D.D. Commission, Bank Commission,
      Shortage, TP. Karda, Etc. will not be allowed from the bill amount.<br/>
      2) No. goods Return, Shortage or any other complaints will be accepted after 3 days
      from the date of delivery challan.<br/>
      3) Goods return or charge should be done by the buyer or packer appointed by the buyer,
      if be fails to do so within 3 days limit. then all the losses will be bared by the buyer.
      4) Shortage will not be deducted without confirmation.<br/>
      5) If any disputes arises about this transaction, the same shall have to be referred to the
      HINDUSTAN CHAMBERS OF COMMERCE MUMBAI for decision under its arbitration rules and
      award made there under shall be binding upon parties & Subject to MUMBAI jurisdiction only
      </p>
    `;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  const olddate = orderData.date.replace('/','-');
  const date = olddate.replace('/','-');
  console.log(date)
  const pdfName = `${file.uri.slice(0,file.uri.lastIndexOf("/") + 1)}${orderData.buyerName}-${date}(${orderData.orderID}).pdf`;

  await FileSystem.moveAsync({
    from: file.uri,
    to: pdfName,
  });
  await shareAsync(pdfName);
};
