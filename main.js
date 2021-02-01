const fetch  = require("node-fetch");
const zlib = require("zlib");

let query = `query HotelReview(
	$locationId: Int!
	$photoCount: Int = 20
	$photoOffset: Int = 0
	$distanceUnit: UnitLengthInput!
	$language: String = "en"
	$roomTipsLimit: Int = 3
	$roomTipsOffset: Int = 0
	$reviewFilters: [FilterConditionInput!]
	$reviewPrefsCacheKey: String!
	$reviewFilterCacheKey: String!
	$geoIds: [Int!]!
	$socialPartialResults: Boolean!
	$keywordVariant: String!
) {
	locations(locationIds: [$locationId]) {
		__typename
		...HotelReviewFields
		...HotelRoomTipsFields
		...HotelReviewSectionFields
	}
	notSortedtReviews: locations(locationIds: [$locationId]) {
		__typename
		...HotelDetailsNotSortedReviews
	}
	coeAward(requests: [{ locations: [$locationId] }]) {
		__typename
		locations
	}
	travelersChoice(locationIds: [$locationId]) {
		__typename
		absoluteUrl
		year
		ranking
	}
	reviewContributions: connectionContributions(
		detailIds: [$locationId]
		geoIds: $geoIds
		placeTypes: [ACCOMMODATION]
		connectionTypes: [ALL]
		contributionTypes: [REVIEW]
		includePartialResults: $socialPartialResults
	) {
		__typename
		...POIConnectionReviewContributions
	}
	locationKeywords(locationIds: [$locationId], variant: $keywordVariant) {
		__typename
		keywords {
			__typename
			keyword
			order
		}
	}
},

fragment HotelReviewFields on LocationInformation {
	__typename
	countryId
	locationId
	name
	geoName
	locationDescription
	isGeo
	locationTimezoneId
	latitude
	longitude
	isClosed
	thumbnail {
		__typename
		...BasicPhotoInformation
	}
	parent {
		__typename
		locationId
		name
		isGeo
		isBroadGeo
	}
	reviewSummary {
		__typename
		count
		rating
	}
	photoCount
	photos(
		filter: {
			mediaGroup: DEFAULT
			mediaTypes: [PHOTO]
			supplierCategories: [OWNER, STAFF, TRAVELER]
		}
		ordering: BIG_CAROUSEL
		page: { limit: $photoCount, offset: $photoOffset }
	) {
		__typename
		id
		photoSizes {
			__typename
			...PhotoSizeFields
		}
	}
	detail {
		__typename
		... on Hotel {
			styleRankings(max: 2) {
				__typename
				translatedName
				score
				geoRanking
			}
			hotel {
				__typename
				reviewSubratingAvgs {
					__typename
					avgRating
					questionId
					answerCount
				}
				numReviews
				walkScore
				greenLeader
				providerStarRating
			}
			...HotelStarRating
			...Amenities
			...NearbyLocations
		}
	}
	streetAddress {
		__typename
		fullAddress
	}
	neighborhoods {
		__typename
		description
	}
	closeAirports: nearestAirports(limit: 2, radius: 500) {
		__typename
		distanceFromCenter
		airportInfo {
			__typename
			locationName
		}
	}
	nearbyTransit: nearby(
		radius: 1
		page: { limit: 2, offset: 0 }
		locationFilter: { placeTypes: [METRO_STATION] }
	) {
		__typename
		locationId
		name
		distanceFromCenter
		placeType
	}
},

fragment HotelRoomTipsFields on LocationInformation {
	__typename
	roomTipsCount
	roomTips(
		language: $language
		page: { limit: $roomTipsLimit, offset: $roomTipsOffset }
	) {
		__typename
		id
		rating
		text
		publishedDate
		userId
		userProfile {
			__typename
			...HotelDetailsUserDetails
		}
	}
},

fragment HotelReviewSectionFields on LocationInformation {
	__typename
	reviewList(
		page: { limit: 5, offset: 0 }
		initialPrefs: { sortType: "connectionsFirst", showMT: true }
		prefs: { sortType: "connectionsFirst", showMT: true }
		filters: $reviewFilters
		prefsCacheKey: $reviewPrefsCacheKey
		filterCacheKey: $reviewFilterCacheKey
	) {
		__typename
		languageCounts
		preferredReviewIds
		ratingCounts
		totalCount
		reviews {
			__typename
			...HotelDetailsHotelReview
		}
	}
},

fragment BasicPhotoInformation on Photo {
	__typename
	photoId: id
	locationId
	caption
	photoSizes {
		__typename
		...PhotoSizeFields
	}
	photoRoute: route {
		__typename
		...BasicPhotoDetailRoute
	}
},

fragment PhotoSizeFields on PhotoSize {
	__typename
	height
	url
	width
,}
fragment BasicPhotoDetailRoute on PhotoDetailRoute {
	__typename
	photoId
	absoluteUrl
,}
fragment HotelStarRating on Hotel {
	__typename
	starTags: tags(tagCategoryTypes: [STAR_RATING]) {
		__typename
		tagId
		tagNameLocalized
	}
},

fragment Amenities on Hotel {
	__typename
	amenityList: amenityList(
		prioritizeUserFilteredAmenities: true
		showOnlyHighlightedAmenities: false
	) {
		__typename
		highlightedAmenities {
			__typename
			propertyAmenities {
				__typename
				amenityCategoryName
				amenityIcon
				amenityNameLocalized
				tagId
				translationKey
			}
			roomAmenities {
				__typename
				amenityCategoryName
				amenityIcon
				amenityNameLocalized
				tagId
				translationKey
			}
		}
		nonHighlightedAmenities {
			__typename
			propertyAmenities {
				__typename
				amenityCategoryName
				amenityIcon
				amenityNameLocalized
				tagId
				translationKey
			}
			roomAmenities {
				__typename
				amenityCategoryName
				amenityIcon
				amenityNameLocalized
				tagId
				translationKey
			}
		}
		languagesSpoken {
			__typename
			amenityCategoryName
			amenityIcon
			amenityNameLocalized
			tagId
			translationKey
		}
	}
},

fragment NearbyLocations on Hotel {
	__typename
	nearbyLocations(distanceUnit: $distanceUnit) {
		__typename
		attractionCount
		distanceRange
		distanceUnit
		hotelCount
		restaurantCount
		locationList {
			__typename
			distanceFromCenter
			locationId
			placeType
			location {
				__typename
				locationId
				name
				url
				latitude
				longitude
				thumbnail {
					__typename
					id
					photoSizes {
						__typename
						height
						isHorizontal
						url
						width
					}
				}
				reviewSummary {
					__typename
					count
					rating
				}
				popIndexDetails {
					__typename
					popIndexRank
					popIndexTotal
				}
				detail {
					__typename
					... on Restaurant {
						cuisines: tags(tagCategoryTypes: [CUISINES]) {
							__typename
							tagId
							tagNameLocalized
						}
						priceRange: tags(tagCategoryTypes: [RESTAURANT_PRICE]) {
							__typename
							tagId
							tag
						}
					}
					... on Attraction {
						category: tags(tagCategoryTypes: [ATTRACTIONS_L2_CATEGORY]) {
							__typename
							tagId
							tagNameLocalized
						}
						categoryType: tags(tagCategoryTypes: [ATTRACTIONS_L3_TYPE]) {
							__typename
							tagId
							tagNameLocalized
						}
					}
				}
			}
		}
	}
},

fragment HotelDetailsUserDetails on MemberProfile {
	__typename
	avatar {
		__typename
		photoSizes {
			__typename
			...PhotoSizeFields
		}
	}
	displayName
	username
	isFollowing
	isVerified
	contributionCounts {
		__typename
		helpfulVote
		sumAllUgc
	}
	hometown {
		__typename
		location {
			__typename
			additionalNames {
				__typename
				longParentAbbreviated
			}
		}
	}
},

fragment HotelDetailsHotelReview on Review {
	__typename
	id
	title
	text
	absoluteUrl
	publishedDateTime
	translationType
	rating
	helpfulVotes
	language
	originalLanguage
	userId
	additionalRatings {
		__typename
		rating
		ratingLabel
	}
	tripInfo {
		__typename
		stayDate
		tripType
	}
	socialStatistics {
		__typename
		isLiked
		isReposted
		isFollowing
	}
	photos {
		__typename
		caption
		id
		publishedDateTime
		thumbsUpVotes
		photoSizes {
			__typename
			...PhotoSizeFields
		}
	}
	ownerResponse {
		__typename
		text
		publishedDateTime
		username
		connectionToSubject
		language
		originalLanguage
		userProfile {
			__typename
			id
			avatar {
				__typename
				photoSizes {
					__typename
					...PhotoSizeFields
				}
			}
		}
	}
	userProfile {
		__typename
		...HotelDetailsUserDetails
	}
},

fragment HotelDetailsNotSortedReviews on LocationInformation {
	__typename
	reviewList(
		page: { limit: 5, offset: 0 }
		initialPrefs: { sortType: "", showMT: true }
		prefs: { sortType: "", showMT: true }
		filters: $reviewFilters
		prefsCacheKey: $reviewPrefsCacheKey
		filterCacheKey: $reviewFilterCacheKey
	) {
		__typename
		preferredReviewIds
		reviews {
			__typename
			...HotelDetailsHotelReview
		}
	}
},

fragment POIConnectionReviewContributions on ConnectionContributionsResult {
	__typename
	status
	contributionsByLocation {
		__typename
		locationId
		userReviewContributions {
			__typename
			reviewId
			rating
			contributionReviewText {
				__typename
				text
			}
			userDisplayInformation {
				__typename
				userId
				fullname
				username
				avatarUrl
			}
		}
	}
}
`
let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
    'Accept-Encoding': 'gzip'
};

let body = JSON.stringify({
    operationName: 'HotelReview',
    variables: { 
        "locationId":3968848,
        "distanceUnit":"KILOMETERS",
        "language":"fr",
        "reviewFilters":[{
            "axis":"LANGUAGE",
            "selections":["fr"]
        }],
        "reviewPrefsCacheKey":"hotelReviewPrefs_3968848",
        "reviewFilterCacheKey":"hotelReviewFilters_3968848",
        "geoIds":[],
        "socialPartialResults":true,
        "keywordVariant":"location_keywords_v2_llr_order_30_fr"
    },
    query: query
});

fetch(url, {headers: headers, method: "POST", body: body})
    .then(function(res){ return res.text() })
    .then(function(res){console.log(res)})