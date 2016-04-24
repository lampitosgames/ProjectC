#This script compiles a list of links to all schools
import json
import os
import re

#Import the company data
JSONFile = open('C:\Users\Daniel\Downloads\CrunchBaseParser\CompanyData\CompData1.json')
CompData = json.load(JSONFile)
JSONFile.close()
#List to hold all the school permalinks
schoolList = []
#For every company in the data set
for comp in CompData:
	#for every founder in this company
	for founder in comp['Founders']:
		#If this founder's school(s) are listed
		if len(founder['SchoolPaths']) > 0:
			#loop through the schools
			for i in range(0, len(founder['SchoolNames'])):
				#if the school's path is not null or empty
				if founder['SchoolPaths'][i] is not None and founder['SchoolNames'][i] != "" and founder['SchoolNames'][i] != " ":
					#append this school's path to the composite list
					schoolList.append(founder['SchoolPaths'][i])
				#else, if the school path doesn't exist or has an issue, continue to the next founder
				else:
					continue
		#else, if this founder has no schools listed, continue to the next founder
		else:
			continue
#create a list of unique schools (there will be duplicates in the original list)
uniqueSchools = list(set(schoolList))
#set the output file location
outputFile = '%s\\%s.txt' % ('C:\Users\Daniel\Downloads\CrunchBaseParser\Output', 'SchoolNames')
#loop through all of the unique schools
for school in uniqueSchools:
	#write the school's path to a file
	try:
		#open the output file for append
		with open(outputFile, 'a') as file:
			#write the school to the file
			file.write(school + "\n")
	#catch exceptions
	except:
		print "Exception for school url " + school
		continue