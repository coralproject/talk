from pymongo import MongoClient
import requests

url = 'http://localhost:3000/api/v1/'
url_asset = '%sasset' % url
url_comment = '%scomments' % url

def main():
    client = MongoClient('localhost', 27017)
    db_wapo = client.original_wapo
    wcomments = db_wapo.comments

    for comment in wcomments.find():
        ncomment = {}
        nasset = {}
        status = comment['object']['status']
        if (status == 'Untouched'):
            ncomment['status'] = ''
        elif (status == 'CommunityFlagged'):
            ncomment['status'] = ''
        elif (status == 'ModeratorApproved'):
            ncomment['status'] = 'accepted'
        elif (status == 'ModeratorDeleted'):
            ncomment['status'] = 'rejected'
        ncomment['body'] = comment['object']['content']
        nasset['url'] = comment['targets'][0]['conversationID']
        ncomment['asset_id'] = post_asset(nasset)
        ncomment['author_id'] = '1'
        post_comment(ncomment)

def post_asset(nasset):
    print 'Posting %s into %s.' % (nasset, url_asset)
    try:
        r = requests.put(url_asset, json=nasset)
        if 'id' in r.json():
            return r.json()['id']
        else:
            ra = requests.get(url_asset, { url: nasset['url']})
            return ra.json()['id']
    except:
        print('Error when getting asset.')
    return 'asset'

def post_comment(ncomment):
    print 'Posting %s into %s.' % (ncomment, url_comment)
    r = requests.post(url_comment, json=ncomment)

if __name__ == '__main__':
    main()
