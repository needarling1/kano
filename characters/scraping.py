from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
import time
from time import sleep

###driver = webdriver.Chrome()
###driver.get('https://anilist.co/search/characters/favorites')
###for i in range(50):
###    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
###    time.sleep(0.5)

###time.sleep(10)
###time.sleep(2)
ani_html = requests.get('https://anilist.co/search/characters/favorites').text

###driver.close()

bsoup = BeautifulSoup(ani_html, 'lxml')
char = bsoup.find('div', class_ = 'page-content')\
            .find('div', class_ = 'search other-type')\
            .find('div', class_ = 'container')\
            .find('div', class_ = 'results cover')\
            .find('a')

###for char in characters: 
name = char.find('div', class_ = 'name').text.strip()
img_link = char.find('div', class_ = 'cover').find('img')['src'].strip()
char_link = 'https://anilist.co' + '' + char['href']

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
options.add_argument("--allow-insecure-localhost")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--enable-javascript")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
options.add_argument('--disable-blink-features=AutomationControlled')

driver1 = webdriver.Chrome(options = options)
driver1.get(char_link)
actions = ActionChains(driver1)
for _ in range(10): 
    actions.send_keys(Keys.PAGE_DOWN).perform()

driver1.get_screenshot_as_file("screenshot.png")

char_html = driver1.page_source
driver1.close()

print(char_html)

csoup = BeautifulSoup(char_html, 'lxml')

media = csoup.find('div', class_ = 'page-content')\
                        .find('div', class_ = 'character-wrap')\
                        .find('div', class_ = 'roles-wrap')\
                        .find('div', class_ = 'roles container')\
                        .find('div').find('div', class_ = 'grid-wrap')\
                        .find('div', class_ = 'role-card')\
                        .find('div').find('a').get_text().strip()





print(name)
print(img_link)
print(media)
