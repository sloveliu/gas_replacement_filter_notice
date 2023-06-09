const today = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");

const main = () => {
  // let start = Date.now();
  position.forEach(sheetName => {
    const { sheet, lastRow, lastColumn } = getSheet(sheetName);
    // const key = getKey(sheet, lastColumn)
    const data = getData(sheet, lastRow, lastColumn);
    checkExpiryDate(data, sheetName)
  })
  // 測試結果反而更慢，可能因要回頭調用 api
  // const workers = [
  //   {
  //     functionName: "checkFilter",
  //     arguments: [position[0]],
  //   },
  //   {
  //     functionName: "checkFilter",
  //     arguments: [position[1]],
  //   },
  //   {
  //     functionName: "checkFilter",
  //     arguments: [position[2]],
  //   },
  // ];
  // RunAll.Do(workers);
  // Logger.log(`Execution time: ${Date.now() - start} ms`);
}

const getSheet = sheetName => {
  const sheet = spreadSheet.getSheetByName(sheetName);
  return {
    sheet: sheet,
    lastRow: sheet.getLastRow(),
    lastColumn: sheet.getLastColumn(),
  }
}

const getKey = (sheet, lastColumn) => {
  return sheet.getRange(1, 1, 1, lastColumn).getValues();
}

const getData = (sheet, lastRow, lastColumn) => {
  return sheet.getRange(3, 1, lastRow - 2, lastColumn).getValues();
}

const checkExpiryDate = (data, sheetName) => {
  data.forEach(value => {
    if (Utilities.formatDate(new Date(value[0]), "Asia/Taipei", "yyyy-MM-dd") === today) {
      notify(`${today} ${sheetName} 濾心更換通知`)
    }
  })
}

const notify = message => {
  UrlFetchApp.fetch(lineApiUrl, {
    "method": "post",
    "payload": { message },
    "headers": { "Authorization": "Bearer " + lineToken }
  });
}
