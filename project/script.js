let table;

// LOADER
function showLoader() {
  // Open SweetAlert2 loading spinner when the DataTable starts processing
  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false, // Disable closing by clicking outside
    didOpen: () => {
      Swal.showLoading(); // Show the loading spinner
    },
  });
}

// ADD ELEMENTS
function appendButton() {
  // check if button exist, then append it
  if (!$("#showModalBtn").length) {
    //add Button to trigger the modal
    let button = $("#button").append(
      '<button id="showModalBtn" class="btn btn-success">Show Modal</button>'
    );
    button[0].addEventListener("click", openModal);
  }
}

function appendTitle() {
  // check if title exist, then append it
  if (!$("h1").length) {
    // add pge title
    $("#title").append("<h1>Data Table</h1>");
  }
}

// TABLE
function filterData(data) {
  return data.map((item) => {
    return {
      task: item.task,
      title: item.title,
      description: item.description,
      colorCode: item.colorCode,
    };
  });
}

function setColumnColor(row) {
  let colorCodeRow = $("td", row)[3]; // Get the 4th column (colorCode)
  let columnColor = $(colorCodeRow).text(); // Extract the colorCode value
  $(colorCodeRow).css("background", columnColor); // Apply the background color
}

function createHeader(settings) {
  // Get the column headers dynamically from 'columns' setting
  const columns = settings.aoColumns;
  const thead = $("#dataTable thead");

  // Dynamically create <thead> based on the column names
  let headerRow = "<tr>";
  columns.forEach(function (col) {
    headerRow += `<th class="text-capitalize">${col.data}</th>`;
  });

  headerRow += "</tr>";
  thead.html(headerRow); // Set the thead content
}

function initDataTable(filteredData) {
  // Initialize the table only the first time
  table = $("#dataTable").DataTable({
    data: filteredData,
    responsive: true,
    scrollX: false,
    autoWidth: true,
    rowCallback: setColumnColor,
    columns: [
      { data: "task" },
      { data: "title" },
      { data: "description" },
      { data: "colorCode" },
    ],

    // Dynamically create the thead
    initComplete: function (settings) {
      createHeader(settings);

      // close the loader when dataTable is loaded
      Swal.close();
    },

    // Reapply color changes after every draw (e.g., after search or pagination)
    drawCallback: function (settings) {
      // Ensure the table is initialized before calling .rows()
      if (table) {
        table.rows().every(function (rowIdx, tableLoop, rowLoop) {
          let row = this.node();
          setColumnColor(row);
        });
      }

      appendButton();
      appendTitle();
    },
  });
}

function createTable(data) {
  // Filter the data to only include the desired properties: task, title, description, and colorCode
  const filteredData = filterData(data);

  // Initialize the DataTable only if it's not initialized yet
  if (!$.fn.dataTable.isDataTable("#dataTable")) {
    initDataTable(filteredData);
  } else {
    // If DataTable is already initialized, just update the data
    table.clear().rows.add(filteredData).draw();
  }
}

// MODAL
function selectImg() {
  return new Promise((resolve, reject) => {
    // Create an invisible file input element
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // Limit to image files only

    // Trigger the file input when the button is clicked
    input.click();

    // Once the user selects a file
    input.addEventListener("change", function () {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // Show SweetAlert2 modal with image preview
          resolve(e.target.result); // Resolve with the image data URL
        };
        reader.readAsDataURL(file); // Convert the image file to a data URL
      } else {
        reject("No file selected");
      }
    });
  });
}

function showImgPreview(result) {
  // Show modal with the image preview
  Swal.fire({
    title: "Image Preview",
    html: `<img src="${result.value}" alt="Selected Image" style="width: 100%; max-width: 400px; border-radius: 10px;">`,
    icon: "success",
    confirmButtonText: "OK",
  });
}

function handleModalResult(result) {
  if (result.isConfirmed) {
    showImgPreview(result); // Show the image preview if confirmed
  } else {
    noFileWarning(); // Show warning if no file is selected
  }
}

function noFileWarning() {
  Swal.fire({
    title: "No file selected",
    text: "You didn't select any file.",
    icon: "warning",
  });
}

function openModal() {
  // Show SweetAlert2 modal with a button
  Swal.fire({
    title: "Select an Image",
    text: "Click the button below to select an image from your computer.",
    icon: "info",
    showCancelButton: false,
    confirmButtonText: "Choose Image",
    preConfirm: selectImg,
  }).then(handleModalResult);
}

// DATA
function fetchData() {
  $.ajax({
    url: "data.php", // URL to the PHP file
    method: "GET", // Use GET or POST depending on your needs
    success: createTable,
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status + " - " + error);
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  showLoader();
  fetchData();

  // Function to reload the DataTable every 60 minutes (3600000ms)
  setInterval(function () {
    fetchData(); // Re-fetch the data every 60 minutes
  }, 3600000); // 60 minutes in milliseconds
});
