from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from time import sleep

options = Options()
options.add_argument("--headless=chrome")
options.add_argument("--window-size=2560,1440")
options.add_argument("--allow-insecure-localhost")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument('log-level=3')
options.add_argument('--ignore-certificate-errors-spki-lists')
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument("--enable-javascript")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")

###driver = webdriver.Chrome(options = options)
###driver.get('https://anilist.co/search/characters/favorites')
###for i in range(50):
###    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
###    time.sleep(0.5)

###time.sleep(10)
###time.sleep(2)
ani_html = requests.get('https://anilist.co/search/characters/favorites').text

###driver.close()

bsoup = BeautifulSoup(ani_html, 'lxml')
characters = bsoup.find('div', class_ = 'page-content')\
            .find('div', class_ = 'search other-type')\
            .find('div', class_ = 'container')\
            .find('div', class_ = 'results cover')\
            .find_all('a')

driver1 = webdriver.Chrome(options=options)

for char in characters: 
    name = char.find('div', class_ = 'name').text.strip()
    img_link = char.find('div', class_ = 'cover').find('img')['src'].strip()
    char_link = 'https://anilist.co' + '' + char['href']

    driver1.get(char_link)

    time.sleep(.5)

    char_html = driver1.page_source
    
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
    print('')

driver1.close()
