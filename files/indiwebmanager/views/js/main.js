// Startup function
$(function()
{
    $('[data-toggle="tooltip"]').tooltip();

    loadCurrentProfileDrivers();
    getStatus();

    $("#drivers_list").change(function() {
        var name = $("#profiles option:selected").text();
        saveProfileDrivers(name, true);
    });

    $("#remote_drivers").change(function() {
        var name = $("#profiles option:selected").text();
        saveProfileDrivers(name, true);
    });
});

function saveProfile() {
    var options = profiles.options;
    var name = options[options.selectedIndex].value;
    // Remove any extra spaces
    name = name.trim();

    var url = "/api/profiles/" + name;

    //console.log(url)

    $.ajax({
        type: 'POST',
        url: encodeURI(url),
        success: function() {
            //console.log("add new a profile " + name);
            saveProfileDrivers(name);
        },
        error: function() {
            $("#notify_message").html('<div class="alert alert-danger">Error adding new profile</div>').fadeIn().delay(4000).fadeOut("slow");
        }
    });
}

function saveProfileInfo() {
    var options = profiles.options;
    var name = options[options.selectedIndex].value;
    console.log(name);
    var autostart = ($('#profile_auto_start').is(':checked')) ? 1 : 0;
    var autoconnect = ($('#profile_auto_connect').is(':checked')) ? 1 : 0;
    var url = "/api/profiles/" + name;

    var profileInfo = {
        "autostart": autostart,
        "autoconnect": autoconnect,
    };
    profileInfo = JSON.stringify(profileInfo);
    console.log("Profile info " + profileInfo);

    console.log(url);

    $.ajax({
        type: 'PUT',
        url: encodeURI(url),
        data: profileInfo,
        contentType: "application/json; charset=utf-8",
        success: function() {
            console.log("Profile " + name + " info is updated");
        },
        error: function() {
            $("#notify_message").html('<div class="alert alert-danger">Error updating profile info</div>').fadeIn().delay(4000).fadeOut("slow");
        }
    });
}

function saveProfileDrivers(profile, silent) {

    if (typeof(silent) === 'undefined') silent = false;

    var url = "/api/profiles/" + profile + "/drivers";
    var drivers = [];

    $("#drivers_list :selected").each(function(i, sel) {
        drivers.push({
            "label": $(sel).text()
        });
    });

    // Check for remote drivers
    var remote = $("#remote_drivers").val();
    if (remote) {
        drivers.push({
            "remote": remote
        });
        console.log({
            "remote": remote
        });
    }

    drivers = JSON.stringify(drivers);

    //console.log("my json string is " + drivers);

    $.ajax({
        type: 'POST',
        url: encodeURI(url),
        data: drivers,
        contentType: "application/json; charset=utf-8",
        success: function() {
            //console.log("Drivers added successfully to profile");
            if (silent === false)
                $("#notify_message").html('<div class="alert alert-success">Profile ' + profile + ' saved.</div>').fadeIn().delay(4000).fadeOut("slow");
        },
        error: function() {
            $("#notify_message").html('<div class="alert alert-danger">Error adding drivers to profile</div>').fadeIn().delay(4000).fadeOut("slow");
        }
    });
}

function loadCurrentProfileDrivers() {
    clearDriverSelection();

    var name = $("#profiles option:selected").text();
    var url = "/api/profiles/" + name + "/labels";

    $.getJSON(url, function(drivers) {
        $.each(drivers, function(i, driver) {
            var label = driver.label;
            //console.log("Driver label is " + label);
            var selector = "#drivers_list [value='" + label + "']";
            $(selector).prop('selected', true);
        });

        $("#drivers_list").selectpicker('refresh');
    });

    url = encodeURI("/api/profiles/" + name + "/remote");

    $.getJSON(url, function(data) {
        if (data && data.drivers !== undefined) {
            $("#remote_drivers").val(data.drivers);
        }
        else {
            $("#remote_drivers").val("");
        }
    });

    loadProfileData();

}

function loadProfileData() {
    var name = $("#profiles option:selected").text();
    var url = encodeURI("/api/profiles/" + name);

    $.getJSON(url, function(info) {
        if (info.autostart == 1)
            $("#profile_auto_start").prop("checked", true);
        else
            $("#profile_auto_start").prop("checked", false);

        if (info.autoconnect == 1)
            $("#profile_auto_connect").prop("checked", true);
        else
            $("#profile_auto_connect").prop("checked", false);

    });
}

function clearDriverSelection() {
    $("#drivers_list option").prop('selected', false);
    $("#drivers_list").selectpicker('refresh');
    // Uncheck Auto Start
    $("#profile_auto").prop("checked", false);
}

function addNewProfile() {
    var profile_name = $("#new_profile_name").val();
    if (profile_name) {
        //console.log("profile is " + profile_name);
        $("#profiles").append("<option id='" + profile_name + "' selected>" + profile_name + "</option>");

        clearDriverSelection();

        $("#notify_message").html('<div class="alert alert-success">Profile ' + profile_name + ' created. Select the profile drivers and then save the profile.</div>').fadeIn().delay(4000).fadeOut("slow");
    }
}

function removeProfile() {
    //console.log("in delete profile");
    var name = $("#profiles option:selected").text();
    var url = "/api/profiles/" + name;

    console.log(url);

    if ($("#profiles option").length == 1) {
        $("#notify_message").html('<div class="alert alert-danger">Cannot delete default profile.</div>').fadeIn().delay(4000).fadeOut("slow");
        return;
    }

    $.ajax({
        type: 'DELETE',
        url: encodeURI(url),
        success: function() {
            //console.log("delete profile " + name);
            $("#profiles option:selected").remove();
            loadCurrentProfileDrivers();

            $("#notify_message").html('<div class="alert alert-success">Profile ' + name + ' deleted.</div>').fadeIn().delay(4000).fadeOut("slow");
        },
        error: function() {
            $("#notify_message").html('<div class="alert alert-danger">Error deleting profile</div>').fadeIn().delay(4000).fadeOut("slow");
        }
    });
}

function toggleServer() {
    var status = $.trim($("#server_command").text());

    if (status == "Start") {
        var profile = $("#profiles option:selected").text();
        var url = "/api/server/start/" + profile;

        $.ajax({
            type: 'POST',
            url: encodeURI(url),
            success: function() {
                //console.log("INDI Server started!");
                getStatus();
            },
            error: function() {
                $("#notify_message").html('<div class="alert alert-danger">Error starting INDI server</div>').fadeIn().delay(4000).fadeOut("slow");
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: "/api/server/stop",
            success: function() {
                //console.log("INDI Server stopped!");
                getStatus();
            },
            error: function() {
                $("#notify_message").html('<div class="alert alert-danger">Error stopping INDI server</div>').fadeIn().delay(4000).fadeOut("slow");
            }
        });
    }
}

function getStatus() {
    $.getJSON("/api/server/status", function(data) {
        if (data[0].status == "True")
            getActiveDrivers();
        else {
            $("#server_command").html("<span class='fa fa-cog' aria-hidden='true'></span> Start");
            $("#server_notify").html("<p class='alert alert-info'>Server is offline.</p>");
        }

    });
}

function getActiveDrivers() {
    $.getJSON("/api/server/drivers", function(data) {
        $("#server_command").html("<span class='fa fa-cog fa-spin' aria-hidden='true'></span> Stop");
        var msg = "<p class='alert alert-success'>Server is online.<ul  class=\"list-unstyled\">";
        var counter = 0;
        $.each(data, function(i, field) {
            msg += "<li>" + "<button class=\"btn btn-xs\" " +
        "onCLick=\"restartDriver('" + field.label + "')\" data-toggle=\"tooltip\" " +
        "title=\"Restart Driver\">" +
        "<span class=\"fa fa-refresh\" aria-hidden=\"true\"></span></button> " +
        field.label + "</li>";
            counter++;
        });

        msg += "</ul></p>";

        $("#server_notify").html(msg);

        if (counter < $("#drivers_list :selected").length) {
            $("#notify_message").html('<div class="alert alert-success">Not all profile drivers are running. Make sure all devices are powered and connected.</div>').fadeIn().delay(4000).fadeOut("slow");
            return;
        }
    });

}


function restartDriver(label) {
        $.ajax({
            type: 'POST',
            url: "/api/drivers/restart/" + label,
            success: function() {
                getStatus();
				$("#notify_message").html('<div class="alert alert-success">Restarting driver "' + label + '" succeeded.</div>').fadeIn().delay(4000).fadeOut("slow");
            },
            error: function() {
                $("#notify_message").html('<div class="alert alert-danger">Error restarting "' + label + '" driver</div>').fadeIn().delay(4000).fadeOut("slow");
            }
        });
}
