% import socket
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- favicon -->
	<link rel="icon" sizes="16x16" type="image/png" href="/static/img/astroberry-16x16.png">

	<!-- If IE use the latest rendering engine -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<!-- Set the page to the width of the device and set the zoon level -->
	<meta name="viewport" content="width = device-width, initial-scale = 1">
	<title>Device Manager</title>
	<link rel="stylesheet" type="text/css" href="/static/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/static/css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="/static/css/bootstrap-select.min.css">
	<link rel="stylesheet" type="text/css" href="/static/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="/static/css/main.css">
	<style>
		.notbold{
		  font-weight:normal
		}
	</style>
</head>
<body>

<div class="container">

	<h4>Device Manager</h4>

	<div id="firstrow" class="row">
		<div class="col-sm-6">
			<div class="form-group">
				<label>Equipment Profile</label>
				<div class="input-group">
					<select onchange="loadCurrentProfileDrivers()" id="profiles" class="form-control">
%for profile in profiles:
    %if saved_profile == profile['name']:
        <option selected>{{profile['name']}}</option>
    %else:
        <option>{{profile['name']}}</option>
    %end
%end
					</select>
					<span class="input-group-btn">
						<button class="btn btn-default btn-icon" onCLick="saveProfile()" data-toggle="tooltip" title="Save Profile"><span class="fa fa-download" aria-hidden="true"></span></button>
						<button class="btn btn-default btn-icon" onClick="removeProfile()" data-toggle="tooltip" title="Delete Profile"><span class="fa fa-minus" aria-hidden="true"></span></button>
					</span>
				</div>
				<div id="profile-action" class="input-group">
					<label class="checkbox-inline"><input id="profile_auto_start" onChange="saveProfileInfo()" type="checkbox" value="Autostart"> Auto Start</label>
					<label class="checkbox-inline"><input id="profile_auto_connect" onChange="saveProfileInfo()" type="checkbox" value="Autoconnect"> Auto Connect</label>
				</div>
			</div>
		</div>

		<div class="col-sm-6">
			<div class="form-group">
				<label>New Profile</label>
				<div class="input-group">
					<input class="form-control" id="new_profile_name" type="text" placeholder="New Profile">
					<span class="input-group-btn">
					<button id="add_profile" onClick="addNewProfile()" class="btn btn-default btn-icon" data-toggle="tooltip" title="Add Profile"><span class="fa fa-plus" aria-hidden="true"></span></button>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6">
			<div class="form-group">
				<label for="drivers" class="control-label">Local Drivers</label>
				<select id="drivers_list" class="form-control selectpicker show-tick" data-live-search="true" title="Select drivers..." data-selected-text-format="count > 5" multiple>
%for family,driver_list in sorted(drivers.items()):
       <optgroup label="{{family}}">
      %for driver in driver_list:
        <option value="{{driver}}" data-tokens="{{driver}}">{{driver}}</option>
      %end
       </optgroup>
%end
				</select>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="form-group">
				<label for="remoteDrivers" class="control-label">Remote Drivers</label>
				<input class="form-control" id="remote_drivers" type="text" placeholder="driver1@remotehost,driver2@remotehost">
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6">
			<button id="server_command" onClick="toggleServer()" class="btn btn-default"><span class="fa fa-cog" aria-hidden="true"></span> Start</button>
		</div>
		<div class="col-sm-6">
			<div id="server_notify" class="well"></div>
			<div id="notify_message"></div>
		</div>
	</div>

</div>

<script src="/static/js/jquery.min.js"></script>
<script src="/static/js/bootstrap.bundle.min.js"></script>
<script src="/static/js/bootstrap-select.min.js"></script>
<script src="/static/js/jquery-ui.min.js"></script>
<script src="/static/js/main.js"></script>

</body>

</html>
