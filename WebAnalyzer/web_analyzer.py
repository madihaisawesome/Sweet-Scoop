# web_analyzer.py

import requests
from bs4 import BeautifulSoup
import re
from collections import Counter
import matplotlib.pyplot as plt

url = "https://en.wikipedia.org/wiki/University_of_Calgary"
headers = {"User-Agent": "lab07-web-analyzer"}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    print(f"Successfully fetched content from {url}")
except Exception as e:
    print(f"Error fetching content: {e}")
    exit()

# Print parsed HTML
print(soup.prettify())

# 3. Data Analysis
headings_count = sum(len(soup.find_all(f"h{i}")) for i in range(1, 7))
links_count = len(soup.find_all("a"))
paragraphs = soup.find_all("p")
paragraphs_count = len(paragraphs)

print("\n--- HTML Tag Counts ---")
print(f"Headings: {headings_count}")
print(f"Links: {links_count}")
print(f"Paragraphs: {paragraphs_count}")

# 4. Word Frequency Analysis
text = soup.get_text().lower()
words = re.findall(r"\b\w+\b", text)
word_counts = Counter(words)

print("\n--- Top 5 Most Frequent Words ---")
for word, count in word_counts.most_common(5):
    print(f"{word}: {count}")

# 5. Keyword Search
keyword = input("\nEnter a keyword to search: ").lower()
keyword_count = text.count(keyword)
print(f'The keyword "{keyword}" appears {keyword_count} times.')

# 6. Finding the Longest Paragraph
longest_paragraph = ""
max_word_count = 0

for p in paragraphs:
    paragraph_text = p.get_text(strip=True)
    paragraph_words = re.findall(r"\b\w+\b", paragraph_text)

    if len(paragraph_words) >= 5 and len(paragraph_words) > max_word_count:
        longest_paragraph = paragraph_text
        max_word_count = len(paragraph_words)

print("\n--- Longest Paragraph ---")
print(f"Word count: {max_word_count}")
print(longest_paragraph)

# 7. Visualizing Results
labels = ["Headings", "Links", "Paragraphs"]
values = [headings_count, links_count, paragraphs_count]

plt.bar(labels, values)
plt.title("Group 01")
plt.ylabel("Count")
plt.xlabel("HTML Elements")
# plt.savefig("web_analysis_results.png")
plt.show()
