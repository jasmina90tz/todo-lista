var max = 0;
    $('document').ready(function(){
        loadTasks();
    });
     
	// add event onclick for button add new todo task
    $('#add-new-task').on('click', function(e) { 
        e.preventDefault();
        var name = $('#new-task-name').val();
        if (name === '') {
            alert('Task name is required!');
        } else {
            if (window.localStorage) {
                var task = {name: name, completed: false};
                localStorage.setItem(max + 1, JSON.stringify(task));
                loadTasks();
            } else {
                console.log("Error: you don't have localStorage!");
            }
        }
        $('#new-task-name').val('');
    });
	
	$('#dataFlag').on('click', function(e) {
		if ($(this).checked) {
			$(this).checked = false;
		} else {
			$(this).checked = true;
		}
	});
	 
	
	// upload csv file for data import 
	$("#upload").bind("click", function () {		
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {		
					if (!document.getElementById("dataFlag").checked) {
						localStorage.clear();
					}
					
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
						if (i === 0) {
							continue;
						}
						var cells = rows[i].split(",");
						var task = {name: cells[0], completed: cells[1] === "true" ? true : false};
						localStorage.setItem(max++, JSON.stringify(task));
                    }
                }
                reader.readAsText($("#fileUpload")[0].files[0]);
				location.reload();
				alert("To-do list loaded from csv file");
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }			
    });
	 
	 
	// download csv files
	function downloadCSV(csv, filename) {
		var csvFile;
		var downloadLink;
		csvFile = new Blob([csv], {type: "text/csv"});
		downloadLink = document.createElement("a");
		downloadLink.download = filename;
		downloadLink.href = window.URL.createObjectURL(csvFile);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}
	 
	
	// export to-do list to csv 
	function exportTableToCSV(filename) {
		var csv = [];
		var rows = $('.oneRow');
		
		csv.push('To-do text,Completed');
		
		for (var i = 0; i < rows.length; i++) {
			var row = [], cols = rows[i].querySelectorAll("td, th");		
			csv.push(cols[0].innerText + ',' +  $(cols[1]).children()[0].checked);     
		}
		downloadCSV(csv.join("\n"), filename);
	}
     
	
	// load to-do list from local storage
    function loadTasks() {
        max = 0;
		$('.oneRow').remove();
        var numberOfItems = localStorage.length;
        for (var i = 0; i < numberOfItems; i++) {
            var key = localStorage.key(i);
            var value = JSON.parse(localStorage.getItem(key));
            if (key > max) {
                max = key;
            }
            var checkbox = "<input type='checkbox' data-id='" + key + "' class='complete' ";
            checkbox += (value.completed === true) ? "checked >": ">";
            $('#list-items').append("<tr class='oneRow'><td class='col-lg-5'>" + value.name + "</td><td class='col-lg-2'>" + checkbox + "</td> <td class='col-lg-5'><a href='#' data-id='" + key + "' class='glyphicon glyphicon-trash remove-task'></a></td></tr>");
        }
        if (numberOfItems !== 0) {
            $('#list-items-msg').css('display','none');
        } else {
		$('#list-items-msg').css('display','block');
		 }
        removeTask();
        completeTask();
    }
     
	 
	// remove to-do task from the list 
    function removeTask() {
        $('a.remove-task').on('click', function(e) {
            localStorage.removeItem($(this).data('id'));
            $(this).closest('td').closest('tr').remove();
            if (localStorage.length !== 0) {
				$('#list-items-msg').css('display','none');
			} else {
				$('#list-items-msg').css('display','block');
			}
        });
    }
     
	
	// mark to-do task as complete 
    function completeTask() {
        $('.complete').on('click', function() {
			if ($(this).checked === true) {
				$(this).checked = false; 
			} else {
				$(this).checked = true; 
			}
            var item = JSON.parse(localStorage.getItem($(this).data('id')));
            var task = {name: item.name, completed: this.checked};
            localStorage.setItem($(this).data('id'), JSON.stringify(task));
        });
    }