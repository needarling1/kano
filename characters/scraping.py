from bs4 import BeautifulSoup
import requests
from selenium import webdriver

ani_html = requests.get('https://anilist.co/search/characters/favorites').text
bsoup = BeautifulSoup(ani_html, 'lxml')

content = bsoup.find('div', class_ = 'page-content')
search = content.find('div', class_ = 'search other-type')
container = search.find('div', class_ = 'container')
cover = container.find('div', class_ = 'results cover')

character = cover.find('a')

name = character.find('div', class_ = 'name').text
img_link = character.find('div', class_ = 'cover').find('img')['src'].replace(' ', '')


print(name, img_link)