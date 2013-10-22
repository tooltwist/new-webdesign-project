
var file = require('file'),
	fs = require('fs'),
	S = require('string');

// var templateDir = '/Users/philipcallender/Development/new-webdesign-project/template';
// var destinationDir = '/tmp/,out';



// Get the commnd line arguments
if (process.argv.length != 5) {
	var arg0 = process.argv[0];
	var arg1 = process.argv[1];
	console.log("Syntax: " + arg0 + " " + arg1 + " <templateDir> <webdesignDir> <new_project_name>");
	process.exit(1);
}
var templateDir = process.argv[2];
var webdesignDir = process.argv[3];
var projectName = process.argv[4];

// Check the template directory exists
if ( !fs.existsSync(templateDir)) {
	console.log("Error: Template directory not found: " + templateDir);
	process.exit(1);
}



// Check the template looks like a template
if ( !S(templateDir).endsWith('/')) {
	templateDir += '/';
}
var navpointsDir = templateDir + "navpoints";
if ( !fs.existsSync(navpointsDir)) {
	console.log("Template directory does not contain navpoints: " + navpointsDir);
	process.exit(1);
}
var widgetsDir = templateDir + "widgets";
if ( !fs.existsSync(widgetsDir)) {
	console.log("Template directory does not contain widgets: " + widgetsDir);
	process.exit(1);
}


// Check the destination directory exists, but does not contain a directory for the new project
if ( !S(webdesignDir).endsWith('/')) {
	webdesignDir += '/';
}
if ( !fs.existsSync(webdesignDir)) {
	console.log("Error: webdesign directory does not exist: " + webdesignDir);
	process.exit(1);
}
var destinationDir = webdesignDir + projectName;
if (fs.existsSync(destinationDir)) {
	console.log("Error: The new project directory already exists, and will not be overridden: " + destinationDir);
	process.exit(1);
}

console.log("Copying");
//process.exit();

// Walk through the 
file.walk(templateDir, function(obj, dirPath, dirs, files) {
	// console.log("obj = " + obj);
	// console.log("dirPath = " + dirPath);
	// console.log("dirs = " + dirs);
	// console.log("files = ", files);
	
	// Check the directory exists
	var dir = dirPath.substring(templateDir.length);
	var newdir = destinationDir + '/' + dir;
	if ( !fs.existsSync(newdir)) {
		fs.mkdirSync(newdir);
	}
	
	// Copy the files
	for (var i = 0; i < files.length; i++) {
		var path = files[i];

		// Get the new file name
		var file = path.substring(templateDir.length);
		var newfile = destinationDir + '/' + file;
		//		console.log('  ' + newfile);
		
		// Ignore some files
		if (
			S(file).endsWith("/.DS_Store")
			|| S(file).contains("/.git")
		) {
			continue;
		}
		
		// Read the file contents		
		// Substitute in the project name, for the right file types
		if (
			// Images
			S(file).endsWith(".png")
			|| S(file).endsWith(".gif")
			|| S(file).endsWith(".jpg")
			|| S(file).endsWith(".jpeg")
			|| S(file).endsWith(".ico")
			// These types shouldn't exist...
			|| S(file).endsWith(".zip")
			|| S(file).endsWith(".jar")
			|| S(file).endsWith(".psd")
			|| S(file).endsWith(".gz")
		) {
			
			// This is a binary file, so do a straight binary copy of the file
			var contents = fs.readFileSync(path);
			//console.log("binary file " + file)
			fs.writeFileSync(newfile, contents);
			
		} else {
			
			// Text file, so copy it whilst replacing 'ZULUZ' with the project name
			var contents = fs.readFileSync(path, 'utf-8');
			//		contents = contents.replace(/ZULUZ/g, projectName);
			contents = contents.replace(/ttdemo/g, 'ZULUZ');
			fs.writeFileSync(newfile, contents);
		}		
	}
});