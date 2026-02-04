from bing_image_downloader import downloader

# 다운로드 받고 싶은 동물 리스트 (원하는대로 수정하세요!)
# 영어/한국어 모두 가능하지만, 검색 정확도를 위해 구체적인 키워드를 쓰면 좋습니다.
animals = [
    "dog face",       # 강아지
    "cat face",       # 고양이
    "dinosaur face",  # 공룡
    "bear face",      # 곰
    "rabbit face"     # 토끼
]

# 각 동물마다 사진을 다운로드합니다
for animal in animals:
    print(f"다운로드 중: {animal}...")
    downloader.download(
        animal,
        limit=20,          # 다운로드할 장수 (너무 많으면 오래 걸려요)
        output_dir='dataset', # 'dataset' 폴더에 저장됩니다
        adult_filter_off=True, 
        force_replace=False, 
        timeout=60
    )

print("모든 다운로드가 완료되었습니다! 'dataset' 폴더를 확인해보세요.")
