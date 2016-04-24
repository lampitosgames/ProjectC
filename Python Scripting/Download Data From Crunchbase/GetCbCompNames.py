import urllib2
import json
import os

#store company data in one big, big-ass array
companies = []
wantedCompanies = []
outputFile = ""
numOfFiles = 1
numOfLines = 0

#get output location
while True:
	outputFolder = raw_input("Where would you like this script to output (folder)\n")
	if not os.path.exists(outputFolder):
		print "Not a valid directory"
		continue
	outputFile = "%s\\CompanyList1.txt" % (outputFolder)
	break

print "Looking for companies..."
#Create the file if it doesn't exist already
if not os.path.isfile(outputFile):
	with open(outputFile, "w") as file:
		file.write("")
#get all the company data
try:
	print "Looking for companies at url location..."
	response = urllib2.urlopen("http://api.crunchbase.com/v/2/organizations?user_key=<omitted>&page=1")
	firstPage = json.load(response)
except urllib2.HTTPError, ex:
	print "Error loading data!"

numberOfPages = firstPage["data"]["paging"]["number_of_pages"]
print "Found %s pages" % (numberOfPages)

for page in range(numberOfPages):
	try:
		print "Looking for page " + str(page+1) + " companies..."
		response = urllib2.urlopen("http://api.crunchbase.com/v/2/organizations?user_key=<omitted>&page=" + str(page+1))
		thisPage = json.load(response)
	except urllib2.HTTPError, ex:
		print "Error loading data!  Continuing to next page"
		continue
	
	for co in thisPage["data"]["items"]:
		companies.append(co)

#print the length of how many companies were found
print "Found " + str(len(companies)) + " companies"
#loop through all companies, and filter out the ones the user wants
for co in companies:
	print "Saving " + repr(co['path'])
	#append the company's name to the array
	wantedCompanies.append(co['path'])
	#check that splits the list into files of 4000 companies each
	if numOfLines < 150000:
		#write the company's name to a file
		try:
			with open(outputFile, 'a') as file:
				file.write(co['path'] + "\n")
				numOfLines += 1
		except UnicodeEncodeError, ex:
			print "Company with name " + repr(co['path']) + " had odd characters, cannot add to text file"
			continue
		except KeyError, ex:
			continue
	else:
		#increase the number of files
		numOfFiles += 1
		#rename the output file
		outputFile = "%s\\CompanyList%s.txt" % (outputFolder, numOfFiles)
		#Create the file if it doesn't exist already
		if not os.path.isfile(outputFile):
			with open(outputFile, "w") as file:
				file.write("")
		#reset the number of lines
		numOfLines = 0
		#write the company's name to a file
		try:
			with open(outputFile, 'a') as file:
				file.write(co['path'] + "\n")
				numOfLines += 1
		except UnicodeEncodeError, ex:
			print "Company with name " + repr(co['path']) + " had odd characters, cannot add to text file"