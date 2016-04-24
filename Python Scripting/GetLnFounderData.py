from linkedin import linkedin
from oauthlib import *
import webbrowser

API_KEY = '75cn0cixuit3q8'
API_SECRET = 'leHuPva3g1qc7dcn'
USER_KEY = '1b0827fd-fa51-484f-9d56-a2d268600b02'
USER_SECRET = '0414e228-4757-4e0e-890f-26da4e4a7512'
RETURN_URL = 'http://www.lampitosgames.com/CollegeToFunding/OAuth'
application = ''

authentication = linkedin.LinkedInDeveloperAuthentication(API_KEY, API_SECRET, USER_KEY, USER_SECRET, RETURN_URL, linkedin.PERMISSIONS.enums.values())
application = linkedin.LinkedInApplication(authentication)

#people = application.search_profile(selectors=[{'people': ['educations', 'first-name', 'last-name', 'public-profile-url']}], params={'company-name': 'Hewlett-Packard', 'first-name': 'Terry', 'last-name': 'Timko'})
#profile = application.get_profile(member_url=people['people']['values'][0]['publicProfileUrl'], selectors=['first-name', 'last-name', 'educations'])
peopleAtApple = application.search_profile(selectors=[{'people': ['first-name', 'last-name']}], params={'company-name': 'Hewlett-Packard', 'first-name': 'Terry', 'last-name': 'Timko'})
print peopleAtApple