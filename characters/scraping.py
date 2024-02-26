from bs4 import BeautifulSoup
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import requests
import time
from time import sleep

options = Options()
options.add_argument("--headless=chrome")
options.add_argument("--window-size=2560,1440")
options.add_argument("--allow-insecure-localhost")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument('log-level=3')
options.add_argument('--ignore-certificate-errors-spki-lists')
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument("--enable-javascript")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")
capabilities = DesiredCapabilities.CHROME
capabilities['pageLoadStrategy'] = 'none'

options1 = Options()
options1.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")

driver = webdriver.Chrome()
driver.get('https://anilist.co/search/characters/favorites')
for _ in range(50):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)

driver.close()


with open('html.txt', 'r') as file:
    # Read the contents of the file
    ani_html = file.read()


bsoup = BeautifulSoup(ani_html, 'lxml')
characters = bsoup.find('div', class_ = 'page-content')\
            .find('div', class_ = 'search other-type')\
            .find('div', class_ = 'container')\
            .find('div', class_ = 'results cover')\
            .find_all('a')

driver1 = webdriver.Chrome(options=options)

json_list = []
i = 0
for char in characters: 
    name = char.find('div', class_ = 'name').text.strip()
    img_link = char.find('div', class_ = 'cover').find('img')['src'].strip()
    char_link = 'https://anilist.co' + '' + char['href']

    driver1.get(char_link)

    try:
        element = WebDriverWait(driver1, 400).until(
        EC.presence_of_element_located((By.CLASS_NAME, "role-card"))
        )

        element = WebDriverWait(driver1, 400).until(
        EC.presence_of_element_located((By.TAG_NAME, "a"))
        )

        time.sleep(1)

        char_html = driver1.page_source
    
        csoup = BeautifulSoup(char_html, 'lxml')
        media = csoup.find('div', class_ = 'page-content')\
                        .find('div', class_ = 'character-wrap')\
                        .find('div', class_ = 'roles-wrap')\
                        .find('div', class_ = 'roles container')\
                        .find('div').find('div', class_ = 'grid-wrap')\
                        .find('div', class_ = 'role-card')\
                        .find('div').find('a').get_text().strip()
    
        json_data = {
            "Id": i,
            "Name": name,
            "Media": media,
            "Image": img_link 
        }

        i += 1

        print(i, name)
    
        json_list.append(json_data)
    except Exception as e:
        print("An error occurred:", e)
        print("rip character")
        try: 
            driver1.close()
            driver1 = webdriver.Chrome(options=options)
            driver1.get(char_link)
            element = WebDriverWait(driver1, 400).until(
            EC.presence_of_element_located((By.CLASS_NAME, "role-card"))
            )

            element = WebDriverWait(driver1, 400).until(
            EC.presence_of_element_located((By.TAG_NAME, "a"))
            )

            time.sleep(1)

            char_html = driver1.page_source
    
            csoup = BeautifulSoup(char_html, 'lxml')
            media = csoup.find('div', class_ = 'page-content')\
                        .find('div', class_ = 'character-wrap')\
                        .find('div', class_ = 'roles-wrap')\
                        .find('div', class_ = 'roles container')\
                        .find('div').find('div', class_ = 'grid-wrap')\
                        .find('div', class_ = 'role-card')\
                        .find('div').find('a').get_text().strip()
    
            json_data = {
                "Id": i,
                "Name": name,
                "Media": media,
                "Image": img_link 
            }

            i += 1

            print(i, name)
    
            json_list.append(json_data)
        except:
            print("rip")

json_s = json.dumps(json_list)

with open('directory.json', 'a') as f:
    f.write(json_s)

driver1.close()

