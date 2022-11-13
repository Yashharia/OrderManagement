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
          <td><b>Design / Color Full: </b>${description}<br/>${
      descriptionHalf && `<b>Design / Color Half: </b>${descriptionHalf}`
    }</td>
          <td>${data.rate}</td>
        </tr>`;
  });

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
    </style>
    
    <table style="width: 100%">
        <tr>
            <td style="width: 50%"><b>GST:</b> 27AAEFJ571301ZN</td>
            <td style="width: 50%; text-align:right"><b>Mob:</b> 9321772374<br>8698999322<br><b>Email:</b> jktexs@gmail.com</td>
        </tr>
    </table>
    <div style="text-align:center">
        <h1>J. K. TEXTILES</h1>
        <p>Adm. Off.: 384-L, Dabholkarwadi, Grd. Floor, Room No. 1, Kalbadevi Road, Mumbai - 400 002. Regd. Off.: 1216, Jai Maharashtra Compound, Narpoli, Bhiwandi - 421 305, Dist. Thane.</p>
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
            <td><b>Buyer Details:</b> ${orderData.buyerName}<br>
            <b>Buyer Address:</b> ${orderData.buyerAddress}</td>
        </tr>
    </table>
    <hr/>
    <table style="width: 100%; margin-bottom: 5px">
        <tr>
            <td><b>Consignee Details:</b> ${orderData.consigneeName}<br>
            <b>Consignee Address:</b> ${orderData.consigneeAddress}</td>
        </tr>
    </table> 
    <hr/>
    <table style="width: 100%; margin-bottom: 5px">
    <tr>
        <td style="width: 50%"><b>Transport:</b> ${orderData.transport}</td>
        <td style="width: 50%;"><b>Broker:</b> ${orderData.broker}</td>
    </tr>
    </table>
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
        <tr>
          <th></th>
          <th>THE RATES ARE ACCORDING TO BHIWANDI DELIVERY</th>
          <th></th>
        </tr>
      </tbody>
    </table>
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
