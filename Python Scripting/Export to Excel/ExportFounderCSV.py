#This script exports a csv file containing data about company founder's schools.  Each founder gets his/her own line
import json
import os
import re

JSONFile = open('C:\Users\Daniel\Downloads\CrunchBaseParser\CompanyData\CompData1.json')
CompData = json.load(JSONFile)
JSONFile.close()

fileString = '"Company Name","Founder","Schools/Degree"\n'
ReStr = '[^0-9a-zA-Z .,?<>;:\[\]|!@#$%^&()\-_=+]+'
for comp in CompData:
	for founder in comp['Founders']:
		#get a string of the company name
		thisCompanyName = re.sub(ReStr, ' ', comp['Company'])
		#Get this founder's data
		thisFounderName = ' '
		thisFounderSandD = ''
		#Get the founder name
		thisFounderName = re.sub(ReStr, ' ', founder['Name'])
		#Get the founder's schools and degrees.  If multiple: School~Degree*: Stanford~BA in Computer Science*Caltech~MA in Computer Engineering*
		#If the schools are listed
		if len(founder['SchoolNames']) > 0:
			for i in range(0, len(founder['SchoolNames'])):
				#if the school name is not null or empty
				if founder['SchoolNames'][i] is not None and founder['SchoolNames'][i] != "" and founder['SchoolNames'][i] != " ":
					thisFounderSandD += re.sub(ReStr, ' ', founder['SchoolNames'][i]) + '~'
				#If the data doesn't exist, put null in it's place
				else:
					thisFounderSandD += 'null~'
				#if the degree type is not null
				#if founder['DegreeTypes'][i] is not None and founder['DegreeTypes'][i] != "" and founder['DegreeTypes'][i] != " ":
				#	thisFounderSandD += re.sub(ReStr, ' ', founder['DegreeTypes'][i]) + ' in '
				#if the degree name is not null
				#if founder['DegreeSubjects'][i] is not None and founder['DegreeSubjects'][i] != "" and founder['DegreeSubjects'][i] != " ":
					#add the degree subject to the string
				#	thisFounderSandD += re.sub(ReStr, ' ', founder['DegreeSubjects'][i]) + '*'
				#If the data doesn't exist, put null in it's place
				#else:
				#	thisFounderSandD += 'null*'
		else:
			continue
		
		#Create a string representing this company's row in the csv file
		thisCompRow = '"' + thisCompanyName + '","' + thisFounderName + '","' + thisFounderSandD + '"\n'
		fileString += thisCompRow

outputFile = '%s\\%s.csv' % ('C:\Users\Daniel\Downloads\CrunchBaseParser\Output', 'FounderData')
print "Saving to disc"
with open(outputFile, 'w') as outFile:
	outFile.write(fileString)
print "Done"