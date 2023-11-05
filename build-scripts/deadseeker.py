#!/usr/bin/env python3


'''
deadseeker.py
Seeking out your 404s in around 50 lines of vanilla Python.
'''

import sys
import urllib
from urllib import request, parse
from urllib.parse import urlparse, urljoin
from urllib.request import Request
from html.parser import HTMLParser
from collections import deque

search_attrs = set(['href', 'src'])
agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'

errors = []

class LinkParser(HTMLParser):
    def __init__(self, home, verbose = False):
        ''':home:    a homepage, e.g. 'https://healeycodes.com/'
           :verbose: boolean for for verbose mode'''
        super().__init__()
        self.home = home
        self.verbose = verbose
        self.checked_links = set()
        self.pages_to_check = deque()
        self.pages_to_check.appendleft([home,"root"])
        self.scanner()
        self.cwp =home

    def scanner(self):
        '''Loop through remaining pages, looking for HTML responses'''
        while self.pages_to_check:
            [cwp,origin] = self.pages_to_check.pop()
            self.cwp = cwp

            req = Request(self.cwp, headers={'User-Agent': agent})
            if self.verbose:
                print(f"\t\t{origin} -> {cwp}")
            try:
                res = request.urlopen(req)
                if 'html' in res.headers['content-type']:
                    with res as f:
                        body = f.read().decode('utf-8', errors='ignore')
                        self.feed(body)
            except urllib.error.HTTPError as e: 
                errors.append([cwp,origin])

    def handle_starttag(self, tag, attrs):
        '''Override parent method and check tag for our attributes'''
        for attr in attrs:
            # ('href', 'http://google.com')
            if attr[0] in search_attrs:
                link = attr[1]
                if not bool(urlparse(link).netloc):  # relative link?
                    link = urljoin(self.cwp, link)
                link = link.split("?")[0].split("#")[0] # might not always be correct - but it is for me
                if link not in self.checked_links:
                    self.checked_links.add(link)
                    self.handle_link(link)

    def handle_link(self, link):
        '''Send a HEAD request to the link, catch any pesky errors'''
        try:
            req = Request(link, headers={'User-Agent': agent}, method='HEAD')
            status = request.urlopen(req).getcode()
        except urllib.error.HTTPError as e:
            print(f'HTTPError: {e.code} - {link} ({self.cwp})')  # (e.g. 404, 501, etc)
        except urllib.error.URLError as e:
            print(f'URLError: {e.reason} - {link} ({self.cwp})')  # (e.g. conn. refused)
        except ValueError as e:
            print(f'ValueError {e} - {link} ({self.cwp})')  # (e.g. missing protocol http)
        else:
            if self.verbose:
                print(f'{status} - {link} ({self.cwp})')
        if self.home in link:
            self.pages_to_check.appendleft([link,self.cwp])



t = LinkParser("http://localhost:8000")

for [dest,source] in errors:
    print(f"ERROR: {source} -> {dest}")
