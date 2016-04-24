#This script gets the cumulative category data from all companies, counts how many times each appears, and exports the data to excel
import json
import os
import re

#import the full company data
JSONFile = open('C:\Users\Daniel\Downloads\CrunchBaseParser\CompanyData\CompData1.json')
RData = json.load(JSONFile)
JSONFile.close()
#create a list to store every category from every company
totalCats = []
#loop through the company data and grab all categories
for comp in RData:
	totalCats += comp['CompanyCategories']
#create a list containing only unique categories (no duplicates)
uniqueCats = list(set(totalCats))
#create a string that will end up as the final CSV file
outputString = '"Category or Tag","Times Appeared"\n'
#loop through every unique category
for cat in uniqueCats:
	#set the current number for this category to zero
	number = 0
	#loop through the cumulative category list and count how many times this unique category appears
	for x in totalCats:
		if x == cat:
			number += 1
	#add the information about this category to the CSV string
	thisString = '"' + re.sub('[^0-9a-zA-Z ]+', '', cat) + '","' + str(number) + '"\n'
	outputString += thisString
#output the data
outputFile = '%s\\%s.csv' % ('C:\Users\Daniel\Downloads\CrunchBaseParser\Output', 'CompanyCategories')
print "Saving to disc"
with open(outputFile, 'w') as outFile:
	outFile.write(outputString)
print "Done"