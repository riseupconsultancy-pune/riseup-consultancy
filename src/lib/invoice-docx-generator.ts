import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export interface InvoiceItemDocxData {
  srNo: number;
  empId?: string | null;
  candidateName: string;
  process?: string | null;
  designation?: string | null;
  dateOfJoining?: string | null;
  billingAmount: number;
}

export interface InvoiceTaxDocxData {
  name: string;
  rate: number;
  amount: number;
}

export interface GenerateInvoiceDocxOptions {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string | null;
  terms?: string;
  placeOfSupply?: string;

  seller: {
    companyName?: string;
    address: string;
    gstin: string;
    pan: string;
    hsnSac: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    termsText?: string;
  };

  client: {
    companyName: string;
    address: string;
    gstin?: string | null;
  };

  items: InvoiceItemDocxData[];

  subTotal: number;
  taxes: InvoiceTaxDocxData[];
  tdsDeducted?: number;
  grandTotal: number;
  totalInWords: string;
  balanceDue?: number;
}

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatCurrency(num: number): string {
  return num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  });
}

/**
 * Builds XML for a candidate item row in Table 2
 */
function buildCandidateRowXml(item: InvoiceItemDocxData): string {
  const sr = escapeXml(String(item.srNo));
  const empId = escapeXml(item.empId || "-");
  const name = escapeXml(item.candidateName);
  const process = escapeXml(item.process || "-");
  const desig = escapeXml(item.designation || "-");
  const doj = escapeXml(item.dateOfJoining || "-");
  const amt = escapeXml(formatCurrency(item.billingAmount));

  return `<w:tr w:rsidR="006930BD">
    <w:trPr><w:trHeight w:val="430"/></w:trPr>
    <w:tc>
      <w:tcPr><w:tcW w:w="454" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="104"/><w:ind w:left="9"/><w:jc w:val="center"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${sr}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1134" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:jc w:val="center"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${empId}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1928" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="100"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${name}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1985" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:jc w:val="center"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${process}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1815" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="100"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${desig}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1248" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:jc w:val="center"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${doj}</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1645" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="100"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${amt}</w:t></w:r></w:p>
    </w:tc>
  </w:tr>`;
}

/**
 * Builds XML for the TOTAL row in Table 2
 */
function buildTotalRowXml(subTotal: number): string {
  const formattedTotal = escapeXml(formatCurrency(subTotal));
  return `<w:tr w:rsidR="006930BD">
    <w:trPr><w:trHeight w:val="427"/></w:trPr>
    <w:tc><w:tcPr><w:tcW w:w="454" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="1134" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="1928" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="1985" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="1815" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1248" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:jc w:val="center"/><w:rPr><w:b/><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>TOTAL</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
      <w:tcPr><w:tcW w:w="1645" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr>
      <w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="100"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:b/><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>${formattedTotal}</w:t></w:r></w:p>
    </w:tc>
  </w:tr>`;
}

/**
 * Builds Table 3 (Amount Summary) XML
 */
function buildAmountSummaryTableXml(
  subTotal: number,
  taxes: InvoiceTaxDocxData[],
  tdsDeducted: number = 0,
  grandTotal: number,
  balanceDue: number = 0
): string {
  const formattedSubTotal = escapeXml(formatCurrency(subTotal));
  const formattedGrandTotal = escapeXml(formatCurrency(grandTotal));
  const formattedTds = tdsDeducted > 0 ? escapeXml(formatCurrency(tdsDeducted)) : "";
  const formattedBalance = balanceDue > 0 ? escapeXml(formatCurrency(balanceDue)) : "";

  let taxRowsXml = "";
  if (taxes.length === 0) {
    taxRowsXml += `<w:tr w:rsidR="006930BD">
      <w:trPr><w:trHeight w:val="389"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>Taxes</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>0</w:t></w:r></w:p></w:tc>
    </w:tr>`;
  } else {
    for (const tax of taxes) {
      const taxLabel = escapeXml(`${tax.name} @ ${tax.rate}%`);
      const taxAmt = escapeXml(formatCurrency(tax.amount));
      taxRowsXml += `<w:tr w:rsidR="006930BD">
        <w:trPr><w:trHeight w:val="389"/></w:trPr>
        <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>${taxLabel}</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>${taxAmt}</w:t></w:r></w:p></w:tc>
      </w:tr>`;
    }
  }

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="0" w:type="auto"/>
      <w:tblInd w:w="151" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:insideH w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:insideV w:val="single" w:sz="6" w:space="0" w:color="000000"/>
      </w:tblBorders>
      <w:tblLayout w:type="fixed"/>
      <w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>
    </w:tblPr>
    <w:tblGrid>
      <w:gridCol w:w="3664"/>
      <w:gridCol w:w="3118"/>
      <w:gridCol w:w="3401"/>
    </w:tblGrid>
    <!-- Row 0: Header -->
    <w:tr w:rsidR="0065286C">
      <w:trPr><w:trHeight w:val="387"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:b/><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="17"/></w:rPr><w:t>Amount Summary</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:b/><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="17"/></w:rPr><w:t>Amount (₹)</w:t></w:r></w:p></w:tc>
    </w:tr>
    <!-- Row 1: Sub Total -->
    <w:tr w:rsidR="006930BD">
      <w:trPr><w:trHeight w:val="389"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>Sub Total</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>${formattedSubTotal}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <!-- Dynamic Tax Rows -->
    ${taxRowsXml}
    <!-- Row: TDS Deducted -->
    <w:tr w:rsidR="006930BD">
      <w:trPr><w:trHeight w:val="390"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>TDS Deducted</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>${formattedTds}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <!-- Row: GRAND TOTAL -->
    <w:tr w:rsidR="006930BD">
      <w:trPr><w:trHeight w:val="390"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:b/><w:sz w:val="18"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>GRAND TOTAL</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:b/><w:sz w:val="18"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>${formattedGrandTotal}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <!-- Row: Balance Due -->
    <w:tr w:rsidR="006930BD">
      <w:trPr><w:trHeight w:val="390"/></w:trPr>
      <w:tc><w:tcPr><w:tcW w:w="3664" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:left="118"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>Balance Due</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3118" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/></w:pPr></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:w="3401" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:ind w:right="200"/><w:jc w:val="right"/><w:rPr><w:sz w:val="17"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>${formattedBalance}</w:t></w:r></w:p></w:tc>
    </w:tr>
  </w:tbl>`;
}

/**
 * Generates an editable Microsoft Word document (.docx) buffer for an invoice,
 * identical to the uploaded invoice_format.docx.
 */
export async function generateInvoiceDocxBuffer(
  options: GenerateInvoiceDocxOptions
): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "src", "assets", "invoice_template.docx");

  if (!fs.existsSync(templatePath)) {
    throw new Error("Invoice DOCX template file not found at " + templatePath);
  }

  const zip = new AdmZip(templatePath);
  let docXml = zip.readAsText("word/document.xml");

  // Helper to find all top-level tables
  function getTableBoundaries(xml: string): Array<{ start: number; end: number; content: string }> {
    const boundaries: Array<{ start: number; end: number; content: string }> = [];
    const tblRegex = /<w:tbl[\s>]/g;
    let match;
    while ((match = tblRegex.exec(xml)) !== null) {
      const start = match.index;
      const endTag = "</w:tbl>";
      const end = xml.indexOf(endTag, start);
      if (end === -1) break;
      const fullEnd = end + endTag.length;
      boundaries.push({
        start,
        end: fullEnd,
        content: xml.substring(start, fullEnd),
      });
      tblRegex.lastIndex = fullEnd;
    }
    return boundaries;
  }

  const tables = getTableBoundaries(docXml);
  if (tables.length < 6) {
    throw new Error(`Expected at least 6 tables in invoice template, found ${tables.length}`);
  }

  // 1. In Table 0 (Meta): replace seller address, GSTIN, PAN, HSN/SAC, Invoice No, etc.
  let table0 = tables[0].content;

  // Address in cell 0
  table0 = table0.replace(
    /(<w:tc>[\s\S]*?<w:t>Address:<\/w:t>[\s\S]*?<\/w:tc>)/,
    `<w:tc><w:tcPr><w:tcW w:w="6236" w:type="dxa"/><w:tcBorders><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="102" w:line="261" w:lineRule="auto"/><w:ind w:left="98"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial"/><w:b/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">Address: </w:t></w:r><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${escapeXml(options.seller.address)}</w:t></w:r></w:p></w:tc>`
  );

  // GSTIN
  table0 = table0.replace(
    /<w:t>27ABLFR4477Q1Z4<\/w:t>/g,
    `<w:t>${escapeXml(options.seller.gstin)}</w:t>`
  );
  // PAN
  table0 = table0.replace(
    /<w:t>ABLFR4477Q<\/w:t>/g,
    `<w:t>${escapeXml(options.seller.pan)}</w:t>`
  );
  // HSN/SAC
  table0 = table0.replace(
    /<w:t>HSN\/SAC No\. : 998512<\/w:t>/g,
    `<w:t>HSN/SAC No. : ${escapeXml(options.seller.hsnSac)}</w:t>`
  );
  // Place of Supply
  table0 = table0.replace(
    /<w:t xml:space="preserve">Place of Supply: <\/w:t><\/w:r><w:r[^>]*><w:t>Pune<\/w:t>/g,
    `<w:t xml:space="preserve">Place of Supply: </w:t></w:r><w:r><w:t>${escapeXml(options.placeOfSupply || "Pune")}</w:t>`
  );

  // Invoice No.: 01
  table0 = table0.replace(
    /(<w:t xml:space="preserve">Invoice No\.:\s*<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<\/w:rPr><w:t>)01(<\/w:t>)/g,
    `$1${escapeXml(options.invoiceNumber)}$2`
  );

  // Invoice Date: 07/09/2026
  table0 = table0.replace(
    /(<w:t xml:space="preserve">Invoice Date:\s*<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<\/w:rPr><w:t>)07\/09\/2026(<\/w:t>)/g,
    `$1${escapeXml(options.invoiceDate)}$2`
  );

  // Terms: 07/10/2026
  table0 = table0.replace(
    /(<w:t xml:space="preserve">\s*Terms:\s*<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<\/w:rPr><w:t>)07\/10\/2026(<\/w:t>)/g,
    `$1${escapeXml(options.terms || "Net 30 Days")}$2`
  );

  // Due Date
  table0 = table0.replace(
    /(<w:t xml:space="preserve">Due Date:\s*<\/w:t><\/w:r>)(<w:r><w:rPr>[\s\S]*?<\/w:rPr><w:tab\/><\/w:r>)/g,
    `$1<w:r><w:rPr><w:rFonts w:ascii="Arial"/><w:b/><w:sz w:val="16"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve"> ${escapeXml(options.dueDate || "")}</w:t></w:r>`
  );

  // 2. In Table 1 (Bill To): replace Client details
  let table1 = tables[1].content;
  table1 = table1.replace(
    /Client \/ Company Name:\s*Digitide Business\s+Solutions \(P\)/g,
    `Client / Company Name: ${escapeXml(options.client.companyName)}`
  );
  table1 = table1.replace(
    /Address:\s*Kharadi Pune -411014/g,
    `Address: ${escapeXml(options.client.address)}`
  );
  table1 = table1.replace(
    /GSTIN:\s*27AACCC4278P1Z3/g,
    `GSTIN: ${escapeXml(options.client.gstin || "N/A")}`
  );

  // 3. In Table 2 (Candidates): replace candidate rows & total
  const table2Xml = tables[2].content;
  const tblPrMatch = table2Xml.match(/<w:tblPr>[\s\S]*?<\/w:tblPr>/);
  const tblGridMatch = table2Xml.match(/<w:tblGrid>[\s\S]*?<\/w:tblGrid>/);
  const headerRowMatch = table2Xml.match(/<w:tr[\s\S]*?SR No\.[\s\S]*?<\/w:tr>/);

  const tblPr = tblPrMatch ? tblPrMatch[0] : "";
  const tblGrid = tblGridMatch ? tblGridMatch[0] : "";
  const headerRow = headerRowMatch ? headerRowMatch[0] : "";

  let newCandidateRows = "";
  options.items.forEach((item, index) => {
    newCandidateRows += buildCandidateRowXml({
      ...item,
      srNo: item.srNo || index + 1,
    });
  });
  const totalRow = buildTotalRowXml(options.subTotal);
  const table2 = `<w:tbl>${tblPr}${tblGrid}${headerRow}${newCandidateRows}${totalRow}</w:tbl>`;

  // 4. In Table 3: Amount summary
  const table3 = buildAmountSummaryTableXml(
    options.subTotal,
    options.taxes,
    options.tdsDeducted || 0,
    options.grandTotal,
    options.balanceDue || 0
  );

  // 5. In Table 4 (Bank): update bank details
  let table4 = tables[4].content;
  table4 = table4.replace(
    /Bank Name:\s*AU Small Finance Bank/g,
    `Bank Name: ${escapeXml(options.seller.bankName)}`
  );
  table4 = table4.replace(
    /Account Name:\s*Rise Up Consultancy Pune/g,
    `Account Name: ${escapeXml(options.seller.accountName)}`
  );
  table4 = table4.replace(
    /Account Number:\s*A\/c\s*2502261678246645/g,
    `Account Number: A/c ${escapeXml(options.seller.accountNumber)}`
  );
  table4 = table4.replace(
    /IFSC Code:\s*AUBL0002616/g,
    `IFSC Code: ${escapeXml(options.seller.ifsc)}`
  );

  // 6. In Table 5 (Terms)
  let table5 = tables[5].content;
  if (options.seller.termsText) {
    table5 = table5.replace(
      /Payment Due:\s*Net\s*\[30\]\s*days[\s\S]*?recovery costs\./g,
      escapeXml(options.seller.termsText)
    );
  }

  // Reconstruct docXml using immutable slices from the original template XML
  let resultXml =
    docXml.substring(0, tables[0].start) +
    table0 +
    docXml.substring(tables[0].end, tables[1].start) +
    table1 +
    docXml.substring(tables[1].end, tables[2].start) +
    table2 +
    docXml.substring(tables[2].end, tables[3].start) +
    table3 +
    docXml.substring(tables[3].end, tables[4].start) +
    table4 +
    docXml.substring(tables[4].end, tables[5].start) +
    table5 +
    docXml.substring(tables[5].end);

  // Replace Total in Words in the template text
  resultXml = resultXml.replace(
    /<w:t xml:space="preserve">Total in Words:\s*<\/w:t>/g,
    `<w:t xml:space="preserve">Total in Words: ${escapeXml(options.totalInWords)}</w:t>`
  );

  // Update document.xml in the zip
  zip.updateFile("word/document.xml", Buffer.from(resultXml, "utf-8"));

  return zip.toBuffer();
}
