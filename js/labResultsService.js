//
// Author David Herrera on Summer 2016, Email:davidfherrerar@gmail.com
//
var myApp=angular.module('myApp');
myApp.service('LabResults',['$filter',function($filter){
	var testResults = [];
	var testResultsByDate = {};
	var testResultsByType = {};
	var testResultsByCategory = {};
	var testResultsByDateArray=[];
	var testResultsByTypeArray=[];
	var categories = ['Complete Blood Count','Electrolytes','Other','Tumor markers'];
	var CATEGORY_ONE = 'Complete Blood Count'; // WBC, RBC, HGB, HCT, Platelet, Neutrophils, Eosinophils
	var CATEGORY_TWO = 'Electrolytes'; // Sodium, potassium, glucose, creatinine, calcium, corrected calcium, magnesium
	var CATEGORY_THREE = 'Other'; // LDH, T4, TSH, albumin, protein, AST, ALT, alkaline phosophatase
	var CATEGORY_FOUR = 'Tumor markers'; //CEA, CA 15-3, CA-125
	var categoryOneTests = ['WBC', 'RBC', 'HGB', 'HCT', 'Platelet Count', 'Neutrophils', 'Eosinophils'];
	var categoryTwoTests = ['Sodium', 'Potassium', 'Glucose, Random', 'Creatinine', 'Calcium', 'Corrected Calcium', 'Magnesium'];
	var categoryThreeTests = ['LDH', 'T4', 'T4, Free', 'TSH', 'Albumin', 'Protein, Total', 'AST (SGOT)', 'ALT (SGPT)', 'Alkaline Phosphatase'];
	var categoryFourTests = ['CEA', 'CA 15-3', 'CA-125'];

 function addTestResults(tests) {
	 console.log(tests);
	 if(typeof tests=='undefined') return;
		for (var key=0;key< tests.length;key++) {

			var testResult = tests[key];
			testResult.TestDateFormat=$filter('formatDate')(testResult.TestDate);
			var testResultDate = testResult.TestDate.substring(0,testResult.TestDate.indexOf(' '));
			var testResultType = testResult.FacComponentName;
			var testCategory = undefined;
			
			// Assign test to category
			if (categoryOneTests.indexOf(testResultType) > -1) {
				testCategory = CATEGORY_ONE;
			} else if(categoryTwoTests.indexOf(testResultType) > -1){
				testCategory = CATEGORY_TWO;
			} else if(categoryThreeTests.indexOf(testResultType) > -1){
				testCategory = CATEGORY_THREE;
			} else if(categoryFourTests.indexOf(testResultType) > -1) {
				testCategory = CATEGORY_FOUR;
			}
			testResult.testCategory = testCategory;

			// Filter by test date
			if (!testResultsByDate[testResultDate]) {
				testResultsByDate[testResultDate] = {};
				testResultsByDate[testResultDate].Category = testCategory;
				testResultsByDate[testResultDate].testDate = testResult.TestDate;
				testResultsByDate[testResultDate].testDateFormat = $filter('formatDate')(testResult.TestDate);
				testResultsByDate[testResultDate].testsByDate = [];
				testResultsByDate[testResultDate].testsByDate.push(testResult);
			} else {
				testResultsByDate[testResultDate].testsByDate.push(testResult);
			}

			// Filter by test name
			if (!testResultsByType[testResultType]) {
				testResultsByType[testResultType] = {};
				testResultsByType[testResultType].testCategory = testCategory;
				testResultsByType[testResultType].FacComponentName = testResultType;
				testResultsByType[testResultType].testResults = [];
				testResultsByType[testResultType].testResults.push(testResult);
			} else {
				testResultsByType[testResultType].testResults.push(testResult);
			}
			testResults.push(testResult);
		}

		for (var keyType in testResultsByType) {
			testResultsByTypeArray.push(testResultsByType[keyType]);
			var category = testResultsByType[keyType].testCategory;
			if (!testResultsByCategory[category]) {
				testResultsByCategory[category] = {};
				testResultsByCategory[category].testCategory = category;
				testResultsByCategory[category].testResults = [];
				testResultsByCategory[category].testResults.push(testResultsByType[keyType]);
			} else {
				testResultsByCategory[category].testResults.push(testResultsByType[keyType]);
			}
		}
		for (var date in testResultsByDate) {
			for (var index = 0; index < testResultsByDate[date].testsByDate.length; index++) {
				testResultsByDate[date].testsByDate[index].testResults= testResultsByType[testResultsByDate[date].testsByDate[index].FacComponentName].testResults;
			}
			testResultsByDateArray.push(testResultsByDate[date]);
		}
		
		testResultsByTypeArray = $filter('orderBy')(testResultsByTypeArray,'testCategory');
		console.log(testResultsByDateArray);
		testResultsByDateArray=$filter('orderBy')(testResultsByDateArray,'testDateFormat',true);
		console.log(testResultsByDateArray);
 }
	return{
		updateTestResults:function(tests)
		{
			addTestResults(tests);
		},
		setTestResults:function(tests){

			/**
				TODO: The only tests taken into account are Laurie's tests.
				Once we start accessing other patients' tests, the code below
				will have to be updated accordingly.
			**/
			testResults = [];
			testResultsByDate = {};
			testResultsByType = {};
			testResultsByCategory = {};
			testResultsByDateArray=[];
			testResultsByTypeArray=[];
			addTestResults(tests);
		},
		//Key for date type is a date, for category is a test category, favorites doesnt need a key
		getTestsBySortingType:function(type, key)
		{
			if(type=='Date')
			{

			}else if(type=='Category')
			{

			}else if(type=='Favorites')
			{

			}
		},
		getTestCategories:function()
		{
			return categories;
		},
		// getTestResults:function(){
		// 	return testResults;
		// },
		getTestResults:function()
		{
			return testResultsByTypeArray;
		},
		getTestResultsArrayByDate:function()
		{
			return testResultsByDateArray;
		},
		getTestResultsByDate:function(){
			return testResultsByDate;
		},

		getTestResultsByType:function(){
			return testResultsByType;
		},
		getTestResultsByCategory:function(){
			return testResultsByCategory;
		}
	}
}]);
