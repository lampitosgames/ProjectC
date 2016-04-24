import urllib2
import json
import os
import re

#store user input on where the company file list is located
companiesFile = ""
outputFolder = ""
errorFile = ""
outputFile = ""
investorsFile = ""
outputFileName = ""

thisNumber = ""
startOnLine = 0
#store the list of companies
companies = []
#store urls for where company json data is located
companyURLs = []
companyData = []

#while the user doesn't provide a valid file path
while True:
	#try to open and read file...
	try:
		thisNumber = raw_input("Number of this program\n")
		startOnLine = raw_input("What company should we start with in the source file?\n")
		#ask the user to input file location
		#companiesFile = raw_input("Please input a filepath to a text file that holds company locations on seperate lines\n")
		companiesFile = "C:\Users\Daniel\Downloads\CrunchBaseParser\CompanyData\CompanyList%s.txt" % (thisNumber)
		#get an output folder
		outputFolder = "C:\Users\Daniel\Downloads\CrunchBaseParser\Output"
		#get what this output file is to be called
		outputFileName = "CompData%s" % (thisNumber)
		if not os.path.exists(outputFolder):
			os.makedirs(outputFolder)
		errorFile = '%s\\errors.txt' % (outputFolder)
		outputFile = '%s\\%s.json' % (outputFolder, outputFileName)
		#read all lines in file
		with open(companiesFile) as file:
			companies = file.readlines()
		#an temp array to hold formatted strings of data
		tempCompanies = []
		#loop through all the companies
		for company in companies:
			#remove all newlines
			a = company.replace("\n", "")
			#append to the temp array that holds formatted company names
			tempCompanies.append(a)
		#save formatted company names to the real company names array
		companies = tempCompanies
		#break out of the loop
		break
	#Catch the not valid filepath error
	except IOError:
		print "Not valid file/filepath"

for co in companies:
	print "Parsing " + co + " to url format"
	companyURLs.append("http://api.crunchbase.com/v/2/" + co + "?user_key=<omitted>")

#Import existing data
askImport = raw_input("Should we import existing data and add to it? y/n")
#If the user wants to import
if askImport == 'y':
	print "Importing data from " + outputFile
	#Import the data, and save it to the company list variable
	JSONFile = open(outputFile)
	companyData = json.load(JSONFile)
	JSONFile.close()

companyNumber = 0
numOfComps = str(len(companyURLs))
#At this point, we have the URL locations for all the companies, and are ready to grab the JSON data from crunchbase
for co in companyURLs:
	#Loop through until the company that
	if companyNumber < int(startOnLine):
		print "Skipping " + str(companyNumber)
		companyNumber += 1
		continue
	#if the number of companies processed so far is divisible by 200, save the data
	if companyNumber % 200 == 0:
		print "Saving data..."
		try:
			with open(outputFile, 'w') as outFile:
				json.dump(companyData, outFile)
			print "Data saved!"
		except:
			print "could not save data"
	companyNumber += 1
	#tell user we are getting data from a url
	print "Company #" + str(companyNumber) + "/" + str(numOfComps) + ": Getting data from " + co
	#try to get json data from url
	try:
		response = urllib2.urlopen(co)
		data = json.load(response)
	#catch httperrors that are thrown.  This is usually caused by an incorrect company name
	except urllib2.HTTPError, ex:
		#tell the user the url is invalid
		print "Error loading data from url " + co
		print "This error is a result of an incorrect company name in the source file"
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Company not found: " + co + "\n")
		#tell the user we are moving on
		print "Ignoring error and moving on"
		#continue to next iteration
		continue
	except ValueError, ex:
		print "Invalid source JSON.  Continuing"
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Company not found: " + co + "\n")
		continue
	except urllib2.URLError, ex:
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Company not found: " + co + "\n")
		continue
	except:
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Company not found: " + co + "\n")
		continue
	#Create a new object with only the data we want for the current company
	try:
		thisData = {
			"Company": data['data']['properties']['name'],
			"CompanyCategories": [],
			"ShortDesc": "",
			"LongDesc": "",
			"Address": "",
			"ApartmentNum": "",
			"City": "",
			"State": "",
			"Country": "",
			"DateFounded": "",
			"NumOfEmployees": 0,
			"Acquisition": {
				"Date": '',
				"Price": '',
				"CurrencyCode": '',
				"AcquirerName": '',
				"AcquirerPath": ''
			},
			"IPO": {
				"Date": '',
				"MoneyRaised": '',
				"MoneySymbold": '',
				"OpeningValuation": '',
				"StockSymbol": ''
			},
			"CEO": "",
			"Founders": [],
			"URL": "",
			"CrunchbaseURL": "http://www.crunchbase.com/organization/" + data['data']['properties']['permalink'],
			"FundingDataLink": "",
			"FundingAmount": 0,
			"FundingRounds": []
		}
	except UnicodeEncodeError:
		print "Problem parsing data for " + co
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Problem parsing data for company: " + co + "\n")
		continue
	except KeyError:
		print "problem with 'property' tag"
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Problem with 'property' tag for company: " + co + "\n")
		continue
	except:
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Unknown error occured: " + co + "\n")
		continue
	try:
		#Get Funding Rounds/Total Funding
		#if company was funded
		if 'funding_rounds' in data['data']['relationships']:
			if data['data']['relationships']['funding_rounds']['paging']['total_items'] > 0 and data['data']['properties']['total_funding_usd'] > 0:
				#save the total amount of money raised
				thisData['FundingAmount'] = data['data']['properties']['total_funding_usd']
				#get the url for funding data
				thisData['FundingDataLink'] = data['data']['relationships']['funding_rounds']['paging']['first_page_url']
				#try to get json data from funding url
				try:
					response = urllib2.urlopen(thisData['FundingDataLink'] + "?user_key=b824e6cd5ed92ca28b68845e96ac7b0a")
					fundingData = json.load(response)
				#catch errors that are thrown.
				except urllib2.HTTPError, ex:
					print "Error loading data from funding URL.  Omitting"
					continue
				except ValueError, ex:
					print "Invalid funding JSON structure.  Omitting"
					continue
				except urllib2.URLError, ex:
					print "Error with the provided funding URL.  Omitting"
					continue
				#Set a variable to temporarily hold all of the funding data
				fundingRounds = []
				#loop through the funding rounds
				for round in fundingData['data']['items']:
					#get the funding url
					thisFundURL = "http://api.crunchbase.com/v/2/" + round['path'] + "?user_key=b824e6cd5ed92ca28b68845e96ac7b0a"
					#fetch funding data
					try:
						thisFundResponse = urllib2.urlopen(thisFundURL)
						thisFundData = json.load(thisFundResponse)
					#catch httperrors that are thrown.  This is usually caused by an incorrect company name
					except urllib2.HTTPError, ex:
						#tell the user the url is invalid
						print "Error loading data for funding round"
						#continue to next iteration
						continue
					except ValueError, ex:
						print "Invalid source JSON.  Continuing"
						continue
					except urllib2.URLError, ex:
						continue
					#save the data we want
					dataWanted = {
						"MoneyRaised": "",
						"FundingType": "",
						"Series": "",
						"Day": "",
						"Month": "",
						"Year": "",
						"AnnouncementDate": ""
					}
					try:
						#get the money raised
						#if the company has an ammount that they've raised
						if 'money_raised_usd' in thisFundData['data']['properties']:
							dataWanted['MoneyRaised'] = thisFundData['data']['properties']['money_raised_usd']
						#get the funding type
						if 'funding_type' in thisFundData['data']['properties']:
							dataWanted['FundingType'] = thisFundData['data']['properties']['funding_type']
							print dataWanted['FundingType'] + " round"
						#get the series
						if 'series' in thisFundData['data']['properties']:
							dataWanted['Series'] = thisFundData['data']['properties']['series']
						#get the day the funding was announced
						if 'announced_on_day' in thisFundData['data']['properties']:
							dataWanted['Day'] = thisFundData['data']['properties']['announced_on_day']
						#get the month the funding was announced
						if 'announced_on_month' in thisFundData['data']['properties']:
							dataWanted['Month'] = thisFundData['data']['properties']['announced_on_month']
						#get the year the funding was announced
						if 'announced_on_year' in thisFundData['data']['properties']:
							dataWanted['Year'] = thisFundData['data']['properties']['announced_on_year']
						#get the date the funding was announced
						if 'announced_on' in thisFundData['data']['properties']:
							dataWanted['AnnouncementDate'] = thisFundData['data']['properties']['announced_on']
					#eat errors for breakfast!
					except:
						continue
					#append the data to the funding round variable for this company
					fundingRounds.append(dataWanted)
				#set the company's funding property equal to the list of rounds
				thisData['FundingRounds'] = fundingRounds
			else:
				print "Company not funded, omitting"
				continue
		else:
			print "Company not funded, omitting"
			continue
		
		#get the short description
		#if the company has a short description
		if 'short_description' in data['data']['properties']:
			thisData['ShortDesc'] = data['data']['properties']['short_description']
		#get the long description
		#if the company has a longer description
		if 'description' in data['data']['properties']:
			thisData['LongDesc'] = data['data']['properties']['description']
		
		#get the date founded
		#if the company has the founded on data
		if 'founded_on' in data['data']['properties']:
			thisData['DateFounded'] = data['data']['properties']['founded_on']
		
		#get the number of employees
		#if the company has the number of employee data
		if 'number_of_employees' in data['data']['properties']:
			thisData['NumOfEmployees'] = data['data']['properties']['number_of_employees']
		
		#get the company homepage url
		#if the company has the url data
		if 'homepage_url' in data['data']['properties']:
			thisData['URL'] = data['data']['properties']['homepage_url']
		
		#get the CEO
		#if there are people listed in the company
		if 'current_team' in data['data']['relationships']:
			#loop through all relationships
			for person in data['data']['relationships']['current_team']['items']:
				#use regex to match the word "CEO" in each person's title
				if re.findall("(CEO)+?", person['title'], re.IGNORECASE):
					#create an object for the CEO
					thisCEO = {
						"Name": '',
						"Title": '',
						"Permalink": '',
						"DegreeTypes": [],
						"DegreeSubjects": [],
						"DegreeAcquiredDates": [],
						"SchoolNames": [],
						"SchoolPaths": []
					}
					#save the CEO's name, title, and permalink
					thisCEO['Name'] = person['first_name'] + ' ' + person['last_name']
					thisCEO['Title'] = person['title']
					thisCEO['Permalink'] = person['path']
					#get the URL for their education data
					educationLink = "http://api.crunchbase.com/v/2/" + person['path'] + "/degrees?user_key=b824e6cd5ed92ca28b68845e96ac7b0a"
					#try to get json data from url
					try:
						educationResponse = urllib2.urlopen(educationLink)
						educationFull = json.load(educationResponse)
					except:
						print "Error with education data"
					#loop through each degree
					if len(educationFull['data']['items']) > 0:
						for degree in educationFull['data']['items']:
							#get the degree type (MA, BA, DR, etc.)
							thisCEO['DegreeTypes'].append(degree['degree_type_name'])
							#get the degree subject
							thisCEO['DegreeSubjects'].append(degree['degree_subject'])
							#get the date on which this person got their degree
							thisCEO['DegreeAcquiredDates'].append(degree['completed_on'])
							#get the school the CEO earned the degree at
							thisCEO['SchoolNames'].append(degree['organization_name'])
							#get the path to that school on crunchbase
							thisCEO['SchoolPaths'].append(degree['organization_path'])
					#set this company's CEO to the 'thisCEO' object we just created
					thisData['CEO'] = thisCEO
		
		#get the founders and corosponding educational data
		#if the founders are listed
		if 'founders' in data['data']['relationships']:
			#loop through each founder
			for person in data['data']['relationships']['founders']['items']:
				#create an object for this founder
				thisFounder = {
					"Name": '',
					"Permalink": '',
					"DegreeTypes": [],
					"DegreeSubjects": [],
					"DegreeAcquiredDates": [],
					"SchoolNames": [],
					"SchoolPaths": []
				}
				#save the person's name and permalink
				thisFounder['Name'] = person['name']
				thisFounder['Permalink'] = person['path']
				#print that we are now getting education data
				print "Getting education data..."
				#get the URL for their education data
				educationLink = "http://api.crunchbase.com/v/2/" + person['path'] + "/degrees?user_key=b824e6cd5ed92ca28b68845e96ac7b0a"
				#try to get json data from url
				try:
					educationResponse = urllib2.urlopen(educationLink)
					educationFull = json.load(educationResponse)
				except:
					print "Error with education data"
				#loop through each degree
				if len(educationFull['data']['items']) > 0:
					for degree in educationFull['data']['items']:
						#get the degree type (MA, BA, DR, etc.)
						thisFounder['DegreeTypes'].append(degree['degree_type_name'])
						#get the degree subject
						thisFounder['DegreeSubjects'].append(degree['degree_subject'])
						#get the date on which this person got their degree
						thisFounder['DegreeAcquiredDates'].append(degree['completed_on'])
						#get the school the founder earned the degree at
						thisFounder['SchoolNames'].append(degree['organization_name'])
						#get the path to that school on crunchbase
						thisFounder['SchoolPaths'].append(degree['organization_path'])
				#append to the founder data with this person's info
				thisData['Founders'].append(thisFounder)
		
		#get the location of the headquarters
		#if the headquarters data exists
		if 'headquarters' in data['data']['relationships']:
			#if exactly one location is listed under headquarters
			if len(data['data']['relationships']['headquarters']['items']) < 2:
				#use the first location
				thisLocation = data['data']['relationships']['headquarters']['items'][0]
				#save the location
				thisData['Address'] = thisLocation['street_1']
				thisData['ApartmentNumber'] = thisLocation['street_2']
				thisData['City'] = thisLocation['city']
				thisData['State'] = thisLocation['region']
				thisData['Country'] = thisLocation['country_code']
			#else, there are multiple headquarters
			else:
				#change each of the values in the HQ location to an array
				thisData['Address'] = []
				thisData['ApartmentNumber'] = []
				thisData['City'] = []
				thisData['State'] = []
				thisData['Country'] = []
				#loop through each location
				for thisLocation in data['data']['relationships']['headquarters']['items']:
					#save the location
					thisData['Address'].append(thisLocation['street_1'])
					thisData['ApartmentNumber'].append(thisLocation['street_2'])
					thisData['City'].append(thisLocation['city'])
					thisData['State'].append(thisLocation['region'])
					thisData['Country'].append(thisLocation['country_code'])
		else:
			thisData['Address'] = "No location provided"
		
		#Get all categories for this company
		#if the category data exists
		if 'categories' in data['data']['relationships']:
			#if all of the category data is present
			if len(data['data']['relationships']['categories']['items']) == data['data']['relationships']['categories']['paging']['total_items']:
				for cat in data['data']['relationships']['categories']['items']:
					thisData['CompanyCategories'].append(cat['name'])
			#else, if some of the categories have been omitted
			else:
				#get all the categories for this company (a page contains 1000.  I doubt any company has more than 1000 categories)
				try:
					categoriesResponse = urllib2.urlopen(data['data']['relationships']['categories']['paging']['first_page_url'] + "?user_key=b824e6cd5ed92ca28b68845e96ac7b0a")
					categoriesData = json.load(categoriesResponse)
				except:
					continue
				#get all the categories and save them to the company data
				for cat in categoriesData['data']['items']:
					thisData['CompanyCategories'].append(cat['name'])
		else:
			thisData['CompanyCategories'].append("None")
		
		#If it exists, get the acquisition data
		if 'acquired_by' in data['data']['relationships']:
			print "Getting Acquisition Data"
			acquisitionLink = "http://api.crunchbase.com/v/2/" + data['data']['relationships']['acquired_by']['items'][0]['path'] + "?user_key=b824e6cd5ed92ca28b68845e96ac7b0a"
			#try to get json data from url
			try:
				acquisitionResponse = urllib2.urlopen(acquisitionLink)
				acquisitionFull = json.load(acquisitionResponse)
			except:
				continue
			#Get all of the acquisition data, and save it to the company object
			#get the date
			if 'announced_on' in acquisitionFull['data']['properties']:
				thisData['Acquisition']['Date'] = acquisitionFull['data']['properties']['announced_on']
			#get the price
			if 'price' in acquisitionFull['data']['properties']:
				thisData['Acquisition']['Price'] = acquisitionFull['data']['properties']['price']
			#get the currency code
			if 'price_currency_code' in acquisitionFull['data']['properties']:
				thisData['Acquisition']['CurrencyCode'] = acquisitionFull['data']['properties']['price_currency_code']
			#get the name of the buying company
			if 'acquirer' in acquisitionFull['data']['relationships']:
				thisData['Acquisition']['AcquirerName'] = acquisitionFull['data']['relationships']['acquirer']['items'][0]['name']
			#get the opening valuation
			if 'acquirer' in acquisitionFull['data']['relationships']:
				thisData['Acquisition']['AcquirerPath'] = acquisitionFull['data']['relationships']['acquirer']['items'][0]['path']
		
		#If it exists, get the IPO data
		if 'ipo' in data['data']['relationships']:
			print "Getting IPO data"
			ipoLink = "http://api.crunchbase.com/v/2/" + data['data']['relationships']['ipo']['items'][0]['path'] + "?user_key=b824e6cd5ed92ca28b68845e96ac7b0a"
			#try to get json data from url
			try:
				ipoResponse = urllib2.urlopen(ipoLink)
				ipoFull = json.load(ipoResponse)
			except:
				continue
			#Get all of the IPO data, and save it to the company object
			#get the date
			if 'went_public_on' in ipoFull['data']['properties']:
				thisData['IPO']['Date'] = ipoFull['data']['properties']['went_public_on']
			#get the ammount raised
			if 'money_raised' in ipoFull['data']['properties']:
				thisData['IPO']['MoneyRaised'] = ipoFull['data']['properties']['money_raised']
			#get the currency code for the money raised
			if 'money_raised_currency_code' in ipoFull['data']['properties']:
				thisData['IPO']['MoneySymbol'] = ipoFull['data']['properties']['money_raised_currency_code']
			#get the opening valuation
			if 'opening_valuation' in ipoFull['data']['properties']:
				thisData['IPO']['OpeningValuation'] = ipoFull['data']['properties']['opening_valuation']
			#get the stock symbol for the company
			if 'stock_symbol' in ipoFull['data']['properties']:
				thisData['IPO']['StockSymbol'] = ipoFull['data']['properties']['stock_symbol']
	except:
		#save the error to an error file so that the user can correct them later
		if not os.path.isfile(errorFile):
			with open(errorFile, "w") as file:
				file.write("")
		with open(errorFile, 'a') as file:
			file.write("Unknown error occured: " + co + "\n")
		continue
	#add the final data for this company to the full data array
	companyData.append(thisData)

with open(outputFile, 'w') as outFile:
	json.dump(companyData, outFile)