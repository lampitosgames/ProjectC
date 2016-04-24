#This script exports one big file containing useful data on each company.  Each funding round gets it's own line
import json
import os
import re
#Import all company data
JSONFile = open('C:\Users\Daniel\Downloads\CrunchBaseParser\CompanyData\CompData1.json')
CompData = json.load(JSONFile)
JSONFile.close()
#Set up the CSV file string
fileString = '"Company Name","Categories/Tags","Short Description","Founders","Address","City","State","Country","Date Founded","Funding Type","Funding Series","Funding Date","Funding Amount","IPO Date","IPO Money Raised","IPO Valuation","Stock Symbol","Acquisition Date","Acquisition Price","Acquisition Acquiring Company"\n'
#This is the regex string that replaces all invalid characters so that the export will be error-free
ReStr = '[^0-9a-zA-Z .,?<>;:\[\]|!@#$%^&*()\-_=+]+'

#loop through every company
for comp in CompData:
	#loop through every funding round this company has
	for round in comp['FundingRounds']:
		#The code below serves to get all the columns of data for a single funding round.  Because crunchbase data is so inconsistent,
		#the code must compensate by making sure that the data exists before adding it to the CSV file
		#get a string of the company name
		thisName = re.sub(ReStr, ' ', comp['Company'])
		#get a string of categories the company belongs to
		thisCategories = ' '
		if len(comp['CompanyCategories']) > 0:
			thisCategories = ''
			for cat in comp['CompanyCategories']:
				thisCategories += re.sub(ReStr, ' ', cat) + ', '
		#get a string of the short description for the company
		thisShortDesc = ' '
		if len(comp['ShortDesc']) > 0:
			thisShortDesc = re.sub(ReStr, ' ', comp['ShortDesc'])
		#get a string with the names of the founders
		thisFounders = ''
		if len(comp['Founders']) > 0:
			for founder in comp['Founders']:
				thisFounders += re.sub(ReStr, ' ', founder['Name']) + ', '
		#get a string of the address of the company's HQ
		thisAddress = ' '
		if comp['Address'] is not None:
			if type(comp['Address']) is list:
				if comp['Address'][0] is not None:
					thisAddress = re.sub(ReStr, ' ', comp['Address'][0])
			else:
				thisAddress = re.sub(ReStr, ' ', comp['Address'])
		#get a string of the city of the company's HQ
		thisCity = ' '
		if comp['City'] is not None:
			if type(comp['City']) is list:
				if comp['City'][0] is not None:
					thisCity = re.sub(ReStr, ' ', comp['City'][0])
			else:
				thisCity = re.sub(ReStr, ' ', comp['City'])
		#get a string of the state of the company's HQ
		thisState = ' '
		if comp['State'] is not None:
			if type(comp['State']) is list:
				if comp['State'][0] is not None:
					thisState = re.sub(ReStr, ' ', comp['State'][0])
			else:
				thisState = re.sub(ReStr, ' ', comp['State'])
		#get a string of the country
		thisCountry = ' '
		if comp['Country'] is not None:
			if type(comp['Country']) is list:
				if comp['Country'][0] is not None:
					thisCountry = re.sub(ReStr, ' ', comp['Country'][0])
			else:
				thisCountry = re.sub(ReStr, ' ', comp['Country'])
		#get the date on which the company was founded
		thisFoundedDate = ' '
		if comp['DateFounded'] is not None:
			thisFoundedDate = re.sub(ReStr, ' ', comp['DateFounded'])
		#get the total number of employees
		thisNumEmployees = ' '
		if comp['NumOfEmployees'] > 0:
			thisNumEmployees = str(comp['NumOfEmployees'])
		#Total company funding
		thisTotalFundingAmount = ' '
		if comp['FundingAmount'] > 0:
			thisTotalFundingAmount = str(comp['FundingAmount'])
		#get the round type
		thisFundingType = ' '
		if round['FundingType'] is not None:
			thisFundingType = re.sub(ReStr, ' ', round['FundingType'])
		#get the round number
		thisFundingSeries = ' '
		if round['Series'] is not None:
			thisFundingSeries = re.sub(ReStr, ' ', round['Series'])
		#get the round date
		thisFundingDate = ' '
		if round['AnnouncementDate'] is not None:
			thisFundingDate = re.sub(ReStr, ' ', round['AnnouncementDate'])
		#get the amount of money raised during this round
		thisFundingAmount = ' '
		if round['MoneyRaised'] is not None:
			thisFundingAmount = re.sub(ReStr, ' ', str(round['MoneyRaised']))
		#check to see if the company has gone public
		thisIPODate = ' '
		thisIPOMoneyRaised = ' '
		thisIPOValuation = ' '
		thisStockSymbol = ' '
		if 'IPO' in comp:
			#get the ipo date
			if comp['IPO']['Date'] is not None:
				thisIPODate = re.sub(ReStr, ' ', comp['IPO']['Date'])
			#get the ipo amount raised
			if comp['IPO']['MoneyRaised'] is not None:
				thisIPOMoneyRaised = re.sub(ReStr, ' ', str(comp['IPO']['MoneyRaised']))
			#get the ipo valuation
			if comp['IPO']['OpeningValuation'] is not None:
				thisIPOValuation = re.sub(ReStr, ' ', str(comp['IPO']['OpeningValuation']))
			#get the company's stock symbol
			if comp['IPO']['StockSymbol'] is not None:
				thisStockSymbol = re.sub(ReStr, ' ', comp['IPO']['StockSymbol'])
		#check to see if the company has been acquired
		thisAcquisitionDate = ' '
		thisAcquisitionPrice = ' '
		thisAcquiringCompany = ' '
		if 'Acquisition' in comp:
			#get the acquisition date
			if comp['Acquisition']['Date'] is not None:
				thisAcquisitionDate = re.sub(ReStr, ' ', comp['Acquisition']['Date'])
			#get the acquisition price
			if comp['Acquisition']['Price'] is not None:
				thisAcquisitionPrice = re.sub(ReStr, ' ', str(comp['Acquisition']['Price']))
			#get the acquiring company
			if comp['Acquisition']['AcquirerName'] is not None:
				thisAcquiringCompany = re.sub(ReStr, ' ', comp['Acquisition']['AcquirerName'])
			
		
		#Create a string representing this company's row in the csv file
		thisCompRow = '"' + thisName + '","' + thisCategories + '","' + thisShortDesc + '","' + thisFounders + '","' + thisAddress + '","' + thisCity + '","' + thisState + '","' + thisCountry + '","' + thisFoundedDate + '","' + thisNumEmployees + '","' + thisTotalFundingAmount + '","' + thisFundingType + '","' + thisFundingSeries + '","' + thisFundingDate + '","' + thisFundingAmount + '","' + thisIPODate + '","' + thisIPOMoneyRaised + '","' + thisIPOValuation + '","' + thisStockSymbol + '","' + thisAcquisitionDate + '","' + thisAcquisitionPrice + '","' + thisAcquiringCompany + '"\n'
		#add this row to the overall csv file
		fileString += thisCompRow
#export the full CSV file
outputFile = '%s\\%s.csv' % ('C:\Users\Daniel\Downloads\CrunchBaseParser\Output', 'CompanyData')
print "Saving to disc"
with open(outputFile, 'w') as outFile:
	outFile.write(fileString)
print "Done"