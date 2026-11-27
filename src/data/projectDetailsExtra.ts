export interface LocalityItem {
  name: { en: string; ta: string };
  distance: string;
  time?: string;
}

export interface ProjectCustomerReview {
  name: string;
  role: { en: string; ta: string };
  rating: number;
  date: string;
  comment: { en: string; ta: string };
}

export interface ProjectExtendedDetails {
  galleryImages: string[];
  videoUrl?: string;
  transportation: LocalityItem[];
  hospitals: LocalityItem[];
  schoolsAndColleges: LocalityItem[];
  groundwater: {
    depth: { en: string; ta: string };
    quality: { en: string; ta: string };
    source: { en: string; ta: string };
  };
  neighborhood: {
    density: { en: string; ta: string };
    surrounding: { en: string; ta: string };
    atmosphere: { en: string; ta: string };
  };
  groundValue: {
    currentRate: { en: string; ta: string };
    guidelineValue: { en: string; ta: string };
  };
  futurePrediction: {
    threeYearROI: string;
    fiveYearROI: string;
    drivers: { en: string[]; ta: string[] };
  };
  customerReviews: ProjectCustomerReview[];
}

export const PROJECT_DETAILS_MAP: Record<string, ProjectExtendedDetails> = {
  // ---------------------------------------------------------------------------
  // 1. RESIDENTIAL FLAT PROJECTS
  // ---------------------------------------------------------------------------
  "flat-projects": {
    galleryImages: [
      "/images/projects/flat-projects/1-exterior.jpg",
      "/images/projects/flat-projects/2-entrance.jpg",
      "/images/projects/flat-projects/3-living.jpg",
      "/images/projects/flat-projects/4-upper-living.jpg",
      "/images/projects/flat-projects/5-bedroom.jpg",
      "/images/projects/flat-projects/6-kitchen.jpg",
      "/images/projects/flat-projects/7-bathroom.jpg",
    ],
    transportation: [
      { name: { en: "K.Pudur & Surveyor Colony Main Road", ta: "கே.புதூர் & சர்வேயர் காலனி பிரதான சாலை" }, distance: "800 m", time: "2 mins" },
      { name: { en: "Mattuthavani Integrated Bus Terminal", ta: "மாட்டுத்தாவணி பேருந்து முனையம்" }, distance: "3.5 km", time: "8 mins" },
      { name: { en: "Madurai Junction Railway Station", ta: "மதுரை ரயில்வே சந்திப்பு" }, distance: "7.5 km", time: "18 mins" },
      { name: { en: "Madurai International Airport", ta: "மதுரை சர்வதேச விமான நிலையம்" }, distance: "16 km", time: "25 mins" },
    ],
    hospitals: [
      { name: { en: "Apollo Speciality Hospital", ta: "அப்பல்லோ ஸ்பெஷாலிட்டி மருத்துவமனை" }, distance: "3.2 km", time: "7 mins" },
      { name: { en: "Meenakshi Mission Hospital & Research", ta: "மீனாட்சி மிஷன் மருத்துவமனை" }, distance: "4.5 km", time: "10 mins" },
      { name: { en: "Government Rajaji Hospital (GRH)", ta: "அரசு ராஜாஜி மருத்துவமனை" }, distance: "6.0 km", time: "14 mins" },
    ],
    schoolsAndColleges: [
      { name: { en: "Mahatma Montessori Matriculation School", ta: "மகாத்மா மாண்டிசோரி பள்ளி" }, distance: "2.0 km", time: "5 mins" },
      { name: { en: "Kendriya Vidyalaya Madurai", ta: "கேந்திரிய வித்யாலயா பள்ளி" }, distance: "3.5 km", time: "8 mins" },
      { name: { en: "The American College & Lady Doak College", ta: "அமெரிக்கன் & லேடி டோக் கல்லூரி" }, distance: "5.0 km", time: "12 mins" },
    ],
    groundwater: {
      depth: { en: "35 – 40 ft Sweet Potable Aquifer", ta: "35 – 40 அடி ஆழத்தில் சுவையான நன்னீர்" },
      quality: { en: "100% Tested Sweet Drinking Water (TDS < 190, Zero Hardness)", ta: "100% பரிசோதிக்கப்பட்ட நன்னீர் (TDS < 190, உப்புத்தன்மை அற்றது)" },
      source: { en: "Deep High-Yield Borewell + Dedicated Water Sump", ta: "ஆழ்துளை கிணறு + தரைமட்ட நீர் தொட்டி" },
    },
    neighborhood: {
      density: { en: "Elite Residential Enclave (Surya Nagar)", ta: "உயர்தர குடியிருப்பு பகுதி (சூர்யா நகர்)" },
      surrounding: { en: "Independent Luxury Villas & High-Profile Executive Residences", ta: "தனி சொகுசு பங்களாக்கள் சூழ அமைந்த பாதுகாப்பான இடம்" },
      atmosphere: { en: "Peaceful, Secure, Wide Bitumen Roads with Good Drainage", ta: "அமைதியான, அகன்ற தார் சாலைகள் கொண்ட பாதுகாப்பான சூழல்" },
    },
    groundValue: {
      currentRate: { en: "₹1.67 Cr (₹6,072 / Sq.Ft Buildup)", ta: "₹1.67 கோடி (₹6,072 / ச.அடி கட்டிடம்)" },
      guidelineValue: { en: "4.12 Cents DTCP Approved Land Extent", ta: "4.12 சென்ட் DTCP அனுமதி பெற்ற மனை" },
    },
    futurePrediction: {
      threeYearROI: "+35% Projected Appreciation",
      fiveYearROI: "+65% Capital Growth",
      drivers: {
        en: [
          "Surya Nagar's high prime residential demand with scarce land availability",
          "Rapid connectivity to Mattuthavani & Madurai Ring Road corridors",
          "High rental yield demand from doctors, professors & IT executives",
        ],
        ta: [
          "சூர்யா நகர் பகுதியில் உள்ள அதிக குடியிருப்பு தேவை மற்றும் மனை தட்டுப்பாடு",
          "மாட்டுத்தாவணி மற்றும் மதுரை ரிங் ரோடு உடனடி போக்குவரத்து வசதி",
          "மருத்துவர்கள், பேராசிரியர்கள் மற்றும் அதிகாரிகளுக்கான அதிக வாடகை வருவாய்",
        ],
      },
    },
    customerReviews: [
      {
        name: "Dr. K. Ravichandran, MD",
        role: { en: "Verified Luxury Villa Buyer", ta: "சொகுசு வில்லா வாடிக்கையாளர்" },
        rating: 5,
        date: "October 2026",
        comment: {
          en: "Surya Promoters delivered unmatched quality in Surya Nagar. The hi-ceiling living room, Dolby Atmos home theatre, and 5 rain shower bathrooms make this the ultimate dream duplex home.",
          ta: "சூர்யா நகரில் அற்புதமான தரம் மற்றும் உயர் கூரை அமைப்புடன் கூடிய வீடு. டால்பி அட்மாஸ் ஹோம் தியேட்டர் மற்றும் 5 பாத்ரூம்கள் எங்கள் குடும்பத்திற்கு மிகுந்த மகிழ்ச்சி அளிக்கிறது.",
        },
      },
      {
        name: "S. Anand Kumar",
        role: { en: "Software Engineering Lead", ta: "மென்பொருள் பொறியாளர்" },
        rating: 5,
        date: "August 2026",
        comment: {
          en: "True IAF veteran transparency. The 4.12 cents DTCP approved land and 2750 sqft buildup area was verified with 100% clear titles. Best investment in Madurai.",
          ta: "விமானப்படை அதிகாரியின் நேர்மையான அணுகுமுறை. 4.12 சென்ட் DTCP மனை மற்றும் 2,750 ச.அடி கட்டிடம் அனைத்தும் 100% தெளிவான பட்டா ஆவணங்களுடன் வழங்கப்பட்டது.",
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. VAIGAI ELITE GARDEN (Commercial)
  // ---------------------------------------------------------------------------
  "vaigai-elite": {
    galleryImages: [
      "/images/VG/VG6.jpeg",
      "/images/VG/VG2.jpeg",
      "/images/VG/VG1.jpeg",
      "/images/VG/VG3.jpeg",
      "/images/VG/VG4.jpeg",
    ],
    transportation: [
      { name: { en: "Madurai – Rameshwaram NH Direct Frontage (700 ft)", ta: "மதுரை – ராமேஸ்வரம் தேசிய நெடுஞ்சாலை நேரடி முகப்பு (700 அடி)" }, distance: "0 km (Direct Access)", time: "0 mins" },
      { name: { en: "Viraganur Roundana (Madurai)", ta: "விரகனூர் ரவுண்டானா (மதுரை)" }, distance: "6.0 km", time: "7 mins" },
      { name: { en: "Upcoming Madurai Outer Ring Road Junction", ta: "மதுரை வெளிவட்ட சாலை சந்திப்பு" }, distance: "0.5 km", time: "1 min" },
      { name: { en: "Madurai International Airport", ta: "மதுரை சர்வதேச விமான நிலையம்" }, distance: "15 km", time: "18 mins" },
    ],
    hospitals: [
      { name: { en: "Velammal Medical College Hospital", ta: "வேலம்மாள் மருத்துவக் கல்லூரி மருத்துவமனை" }, distance: "6.5 km", time: "9 mins" },
      { name: { en: "Apollo Specialty Hospital", ta: "அப்பல்லோ சிறப்பு மருத்துவமனை" }, distance: "9.5 km", time: "14 mins" },
    ],
    schoolsAndColleges: [
      { name: { en: "KLN College of Engineering & Information Tech", ta: "கே.எல்.என் பொறியியல் கல்லூரி" }, distance: "10 km", time: "14 mins" },
      { name: { en: "Velammal Global CBSE School", ta: "வேலம்மாள் குளோபல் பள்ளி" }, distance: "5.0 km", time: "7 mins" },
      { name: { en: "Thiyagarajar Arts & Science College", ta: "தியாகராஜர் கலை & அறிவியல் கல்லூரி" }, distance: "7.0 km", time: "10 mins" },
    ],
    groundwater: {
      depth: { en: "35 – 45 ft Sweet River Basin Aquifer", ta: "35 – 45 அடி ஆழத்தில் சுவையான வைகை ஆற்றுப்படுகை நன்னீர்" },
      quality: { en: "Potable Natural Groundwater & Scenic River View", ta: "குடிப்பதற்கு உகந்த இயற்கை நன்னீர் மற்றும் இயற்கை நதி பார்வை" },
      source: { en: "Perennial Vaigai Basin Water Table + Heavy Discharge Borewell", ta: "வற்றாத வைகை ஆற்றுப்படுகை நீர் ஊற்று + ஆழ்துளை கிணறு" },
    },
    neighborhood: {
      density: { en: "High-Growth Madurai–Rameshwaram NH Commercial Belt", ta: "மதுரை – ராமேஸ்வரம் தேசிய நெடுஞ்சாலை அதிவேக வர்த்தக மண்டலம்" },
      surrounding: { en: "Retail Showrooms, Warehousing, Institutions, Fuel/EV Stations & Resorts", ta: "ஷோரூம், கிடங்கு, கல்வி/மருத்துவ நிறுவனம், பெட்ரோல் பங்க், உணவகம் & ரிசார்ட்" },
      atmosphere: { en: "700 ft Direct Highway Frontage, Scenic River Breeze, Multi-Axle Heavy Transport Access", ta: "700 அடி நெடுஞ்சாலை முகப்பு, இயற்கை நதிக்காற்று, கனரக வாகன வசதி" },
    },
    groundValue: {
      currentRate: { en: "5.23 Acres (Split: 1 Acre & above parcels)", ta: "5.23 ஏக்கர் (1 ஏக்கர் மற்றும் அதற்கு மேல்)" },
      guidelineValue: { en: "Very Less Rate vs Other On-Road Lands · Clear Titles", ta: "அருகிலுள்ள நிலங்களை விட மிகக் குறைந்த விலை · தெளிவான பட்டா" },
    },
    futurePrediction: {
      threeYearROI: "+55% Projected Appreciation",
      fiveYearROI: "+110% Capital Growth",
      drivers: {
        en: [
          "Direct 700 ft massive frontage on Madurai–Rameshwaram NH with high vehicle visibility",
          "Just 6 km from Viraganur Roundana & immediate Outer Ring Road connectivity",
          "High demand for logistics warehouses, auto showrooms, institutions & EV stations",
          "Attractively priced entry rate with 100% legally clear computer patta",
        ],
        ta: [
          "மதுரை – ராமேஸ்வரம் தேசிய நெடுஞ்சாலையில் 700 அடி நேரடி பிரம்மாண்ட முகப்பு",
          "விரகனூர் ரவுண்டானாவிலிருந்து வெறும் 6 கி.மீ & ரிங் ரோடு உடனடி இணைப்பு",
          "சரக்கு கிடங்குகள், வாகன ஷோரூம்கள், நிறுவனங்கள் மற்றும் பெட்ரோல் பங்க் அதீத தேவை",
          "அருகிலுள்ள நிலங்களை விட மிகக் குறைந்த முதலீட்டு விலை மற்றும் 100% தெளிவான பட்டா",
        ],
      },
    },
    customerReviews: [
      {
        name: "Er. K. Soundarapandian",
        role: { en: "Logistics & Warehousing Investor", ta: "கிடங்கு மற்றும் சரக்கு முதலீட்டாளர்" },
        rating: 5,
        date: "October 2026",
        comment: {
          en: "Acquired a 2-acre parcel on this Madurai–Rameshwaram NH stretch. The 700 ft frontage, river view, and just 6 km distance to Viraganur Roundana makes it the best commercial plot deal in Madurai.",
          ta: "மதுரை – ராமேஸ்வரம் தேசிய நெடுஞ்சாலையில் 2 ஏக்கர் வாங்கினோம். 700 அடி முகப்பு, நதி பார்வை மற்றும் விரகனூரிலிருந்து 6 கி.மீ தொலைவு என்பது மிகச்சிறந்த வணிக முதலீடு.",
        },
      },
      {
        name: "M. Jayaprakash",
        role: { en: "Hospitality & Commercial Developer", ta: "விருந்தோம்பல் & வணிக ரியல் எஸ்டேட்" },
        rating: 5,
        date: "September 2026",
        comment: {
          en: "Unbeatable price compared to other on-road properties near Viraganur. Surya Promoters provided crystal-clear parent titles and smooth documentation.",
          ta: "விரகனூர் சுற்றுவட்டார ஆன்-ரோடு நிலங்களை விட மிக நியாயமான விலை. சூர்யா குழுவினர் 100% தெளிவான மூலப்பத்திரங்களை உடனடியாக சரிபார்த்து தந்தனர்.",
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. RIVER BELT LAND – VANDIYUR (Commercial)
  // ---------------------------------------------------------------------------
  "vaigai-river": {
    galleryImages: [
      "/images/Riverbeltwal.png",
      "/images/projects/vaigai-commercial.jpg",
      "/images/Riverbelt.png",
    ],
    transportation: [
      { name: { en: "Direct Bye Pass Road Frontage (Mattuthavani to Airport Ring Road)", ta: "நேரடி பை பாஸ் சாலை முகப்பு (மாட்டுத்தாவணி - ஏர்போர்ட் ரிங் ரோடு)" }, distance: "0 km (Direct Access)", time: "0 mins" },
      { name: { en: "Anna Nagar, Madurai", ta: "அண்ணா நகர், மதுரை" }, distance: "1.0 km", time: "2 mins" },
      { name: { en: "Mattuthavani Integrated Bus Terminus", ta: "மாட்டுத்தாவணி ஒருங்கிணைந்த பேருந்து முனையம்" }, distance: "3.0 km", time: "5 mins" },
      { name: { en: "Viraganur Roundana Junction", ta: "விரகனூர் ரவுண்டானா சந்திப்பு" }, distance: "0.5 km", time: "1 min" },
      { name: { en: "Madurai International Airport", ta: "மதுரை சர்வதேச விமான நிலையம்" }, distance: "10 km", time: "14 mins" },
    ],
    hospitals: [
      { name: { en: "Apollo Speciality Hospital (Anna Nagar / Lake View)", ta: "அப்பல்லோ சிறப்பு மருத்துவமனை (அண்ணா நகர்)" }, distance: "1.5 km", time: "3 mins" },
      { name: { en: "Meenakshi Mission Hospital & Research", ta: "மீனாட்சி மிஷன் மருத்துவமனை" }, distance: "3.5 km", time: "7 mins" },
      { name: { en: "Velammal Medical College Hospital", ta: "வேலம்மாள் மருத்துவக் கல்லூரி மருத்துவமனை" }, distance: "5.0 km", time: "9 mins" },
    ],
    schoolsAndColleges: [
      { name: { en: "Suguna International School & Velammal Vidyalaya", ta: "சுகுணா சர்வதேச பள்ளி & வேலம்மாள் வித்யாலயா" }, distance: "2.0 km", time: "4 mins" },
      { name: { en: "Thiagarajar College & American College", ta: "தியாகராஜர் & அமெரிக்கன் கல்லூரி" }, distance: "2.0 km", time: "4 mins" },
      { name: { en: "Madurai Law College & Leading Institutions", ta: "மதுரை சட்டக்கல்லூரி மற்றும் கல்வி நிறுவனங்கள்" }, distance: "3.0 km", time: "6 mins" },
    ],
    groundwater: {
      depth: { en: "25 – 35 ft Sweet Vaigai Riverbed Aquifer", ta: "25 – 35 அடியில் வற்றாத வைகை ஆற்றுப்படுகை நன்னீர்" },
      quality: { en: "Pristine Sweet Potable Groundwater (TDS < 160)", ta: "உயர்தர இனிமையான நன்னீர் (TDS < 160)" },
      source: { en: "Perennial Natural Vaigai Basin Water Table", ta: "வற்றாத வைகை இயற்கை நீர் ஊற்று" },
    },
    neighborhood: {
      density: { en: "High Visibility & Heavy Footfall Commercial Belt", ta: "அதிக பார்வை மற்றும் மக்கள் நடமாட்டம் கொண்ட வணிக மண்டலம்" },
      surrounding: { en: "Showrooms, Warehouses, Retail Stores, Hotels, Hospitals & Corporate Offices", ta: "ஷோரூம்கள், கிடங்குகள், கடைகள், ஹோட்டல்கள், மருத்துவமனைகள் & அலுவலகங்கள்" },
      atmosphere: { en: "Scenic Vaigai River Breeze with Direct Bye Pass Road Frontage", ta: "வைகை நதிக்காற்று மற்றும் நேரடி பை பாஸ் சாலை முகப்பு" },
    },
    groundValue: {
      currentRate: { en: "27 Cent Commercial Land (Bye Pass Frontage)", ta: "27 சென்ட் வணிக மனை (பை பாஸ் சாலை முகப்பு)" },
      guidelineValue: { en: "Very Low Price vs Nearby Properties · Clear Titles", ta: "அருகிலுள்ள நிலங்களை விட மிகக் குறைந்த விலை · தெளிவான பட்டா" },
    },
    futurePrediction: {
      threeYearROI: "+48% Projected Appreciation",
      fiveYearROI: "+95% Capital Growth",
      drivers: {
        en: [
          "Direct Bye Pass Road frontage on Mattuthavani to Airport Ring Road corridor",
          "Scenic Vaigai River view commercial plot just 2 minutes from Anna Nagar",
          "High visibility and heavy footfall suited for showrooms, warehouses, hotels & hospitals",
          "100% clear titles & very low price compared to nearby properties",
        ],
        ta: [
          "மாட்டுத்தாவணி - ஏர்போர்ட் ரிங் ரோடு வழித்தடத்தில் நேரடி பை பாஸ் சாலை முகப்பு",
          "அண்ணா நகரிலிருந்து வெறும் 2 நிமிடத்தில் வைகை நதி நேரடி பார்வை கொண்ட வணிக மனை",
          "ஷோரூம்கள், கிடங்குகள், ஹோட்டல்கள், மருத்துவமனைகளுக்கு ஏற்ற அதிக மக்கள் நடமாட்டம்",
          "100% தெளிவான பட்டா மற்றும் அருகிலுள்ள நிலங்களை விட மிகக் குறைந்த விலை",
        ],
      },
    },
    customerReviews: [
      {
        name: "K. Shanmuga Sundaram",
        role: { en: "Commercial Retailer & Investor", ta: "வணிக சில்லறை முதலீட்டாளர்" },
        rating: 5,
        date: "November 2026",
        comment: {
          en: "The 27 cent extent in Vandiyur with direct Bye Pass road frontage and Vaigai river view is unmatched. Just 2 mins from Anna Nagar at a significantly lower price than surrounding lands.",
          ta: "வண்டியூரில் நேரடி பை பாஸ் சாலை முகப்பு மற்றும் வைகை நதி பார்வையுடன் கூடிய 27 சென்ட் நிலம் அண்ணா நகரிலிருந்து வெறும் 2 நிமிட தொலைவில் மிகக் குறைந்த விலையில் கிடைத்தது. மிகச்சிறந்த வணிக முதலீடு.",
        },
      },
      {
        name: "Dr. R. Meenakshisundaram",
        role: { en: "Hospital & Healthcare Director", ta: "மருத்துவமனை & பரிசோதனை மைய இயக்குநர்" },
        rating: 5,
        date: "September 2026",
        comment: {
          en: "Perfect site for healthcare / hospital development. High visibility, excellent road connectivity to Mattuthavani and airport, with 100% clear parent documents.",
          ta: "மருத்துவமனை மற்றும் நிறுவனங்களுக்கு மிகவும் பொருத்தமான இடம். அதிக பார்வைத் திறன், மாட்டுத்தாவணி மற்றும் ஏர்போர்ட் உடனடி இணைப்பு, தெளிவான மூலப்பத்திரங்கள்.",
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. PANDI KOVIL (Commercial)
  // ---------------------------------------------------------------------------
  "pandi-kovil": {
    galleryImages: [
      "/images/pandi-kovil-commercial-land.jpg",
      "/images/pandikovil-layout.png",
    ],
    videoUrl: "/videos/pandi-kovil-video.mp4",
    transportation: [
      { name: { en: "Mattuthavani", ta: "மாட்டுத்தாவணி" }, distance: "2 km", time: "4 mins" },
      { name: { en: "Anna Nagar", ta: "அண்ணா நகர்" }, distance: "2.5 km", time: "5 mins" },
      { name: { en: "Madurai Airport Road", ta: "மதுரை விமான நிலைய சாலை" }, distance: "Direct access with 130 ft frontage (Near Sivagangai Roundana)" },
    ],
    hospitals: [
      { name: { en: "Guru Hospital (Multi-Speciality)", ta: "குரு மருத்துவமனை" }, distance: "1.2 km", time: "3 mins" },
      { name: { en: "Rio Hospital", ta: "ரியோ மருத்துவமனை" }, distance: "1.0 km", time: "2 mins" },
      { name: { en: "Vikram Hospital", ta: "விக்ரம் மருத்துவமனை" }, distance: "0.5 km", time: "1 min" },
      { name: { en: "Meenakshi Mission Hospital & Research", ta: "மீனாட்சி மிஷன் மருத்துவமனை" }, distance: "1.0 km", time: "2 mins" },
    ],
    schoolsAndColleges: [
      { name: { en: "HCL Tech (IT Company Campus)", ta: "எச்சிஎல் டெக் (தகவல் தொழில்நுட்ப வளாகம்)" }, distance: "0.5 km", time: "1 min" },
      { name: { en: "5 Leading Schools in Vicinity (Vikas, Velammal, etc.)", ta: "அருகிலுள்ள 5 முன்னணி பள்ளிகள் (விகாஸ், வேலம்மாள்)" }, distance: "1.0 - 2.5 km", time: "4 mins" },
    ],
    groundwater: {
      depth: { en: "35 – 45 ft Sweet Potable Borewell Aquifer", ta: "35 – 45 அடியில் சுவையான ஆழ்துளை நீர்" },
      quality: { en: "High-Discharge Tested Potable Water for Commercial Units", ta: "வணிக நிறுவனங்களுக்கு உகந்த உயர்தர நன்னீர்" },
      source: { en: "Dual Deep Heavy-Capacity Borewells Ready", ta: "தடையற்ற ஆழ்துளை கிணற்று நீர் வசதி" },
    },
    neighborhood: {
      density: { en: "Prime Commercial Location & High-Traffic Airport Road Hub", ta: "அதிவேக வளர்ச்சி பெறும் மதுரை ஏர்போர்ட் சாலை வர்த்தக மண்டலம்" },
      surrounding: { en: "Marriage Halls, Meeting Halls, Warehouses, Rooms, Hostels & HCL Tech", ta: "திருமண மண்டபங்கள், கிடங்குகள், தங்கும் விடுதிகள், ஹாஸ்டல்கள் & எச்சிஎல் வளாகம்" },
      atmosphere: { en: "130 Ft Wide Frontage, High Footfall & 24/7 Continuous Vehicular Movement", ta: "130 அடி அகன்ற முகப்பு, அதிக மக்கள் நடமாட்டம் & 24 மணி நேரமும் இயங்கும் போக்குவரத்து" },
    },
    groundValue: {
      currentRate: { en: "60 Cent Commercial Land (130 Ft Frontage)", ta: "60 சென்ட் வணிக மனை (130 அடி முகப்பு)" },
      guidelineValue: { en: "Very Less Rate on This Road · Clear Titles", ta: "இச்சாலையிலுள்ள மற்ற இடங்களை விட மிகக் குறைவு · தெளிவான பட்டா" },
    },
    futurePrediction: {
      threeYearROI: "+45% Projected Appreciation",
      fiveYearROI: "+92% Capital Growth",
      drivers: {
        en: [
          "Prime commercial location on Madurai Airport Road with 130 Ft wide road frontage",
          "Just 2 KM to Mattuthavani, 5 mins to Anna Nagar, near Sivagangai Roundana & HCL Tech",
          "High demand for marriage halls, meeting halls, warehouses, rooms, hostels & retail",
          "Very less rate compared to other properties on this road with 100% clear titles",
        ],
        ta: [
          "மதுரை விமான நிலைய சாலையில் 130 அடி அகன்ற பிரம்மாண்ட சாலை முகப்பு",
          "மாட்டுத்தாவணிக்கு 2 கி.மீ, அண்ணா நகருக்கு 5 நிமிடம், சிவகங்கை ரவுண்டானா & எச்சிஎல் டெக் அருகில்",
          "திருமண மண்டபங்கள், கிடங்குகள், தங்கும் விடுதிகள், ஹாஸ்டல்களுக்கு அதிக தேவை",
          "இச்சாலையிலுள்ள மற்ற இடங்களை விட மிகக் குறைந்த விலை மற்றும் 100% தெளிவான பட்டா",
        ],
      },
    },
    customerReviews: [
      {
        name: "A. Pandiarajan",
        role: { en: "Convention & Marriage Hall Developer", ta: "திருமண மண்டப முதலீட்டாளர்" },
        rating: 5,
        date: "November 2026",
        comment: {
          en: "Purchased this 60 cent site for a grand marriage and meeting hall. The 130 ft wide frontage directly on Madurai Airport Road near Pandi Kovil is the best commercial location in Madurai.",
          ta: "பிரமாண்ட திருமண மண்டபத்திற்காக இந்த 60 சென்ட் இடத்தை வாங்கினோம். பாண்டி கோவில் அருகில் மதுரை ஏர்போர்ட் சாலையில் 130 அடி முகப்பு என்பது மதுரையின் முதன்மையான வணிக இடம்.",
        },
      },
      {
        name: "K. Muthukrishnan",
        role: { en: "Logistics & Commercial Investor", ta: "கிடங்கு மற்றும் வணிக முதலீட்டாளர்" },
        rating: 5,
        date: "October 2026",
        comment: {
          en: "The rate is very low compared to other properties on this road. Just 2 km from Mattuthavani and close to HCL Tech. Clear titles and smooth deal by Surya Promoters.",
          ta: "இச்சாலையிலுள்ள மற்ற இடங்களை விட விலை மிகக் குறைவு. மாட்டுத்தாவணியிலிருந்து வெறும் 2 கி.மீ மற்றும் எச்சிஎல் டெக் அருகில். சூர்யா குழுவினரின் ஆவணங்கள் 100% நேர்மையாக இருந்தன.",
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 8. MADURAI FARMS & FRUITS (Farm Land)
  // ---------------------------------------------------------------------------
  "madurai-farms": {
    galleryImages: [
      "/images/projects/madurai-farms/aerial-cottage.jpg",
      "/images/projects/madurai-farms/entrance-gate.jpg",
      "/images/projects/madurai-farms/concrete-pathway.jpg",
      "/images/projects/madurai-farms/aerial-grove.jpg",
      "/images/projects/madurai-farms/water-reservoir.jpg",
      "/images/projects/madurai-farms/panoramic-view.jpg",
      "/images/projects/madurai-farms/1.jpg",
      "/images/projects/madurai-farms/2.jpg",
      "/images/projects/madurai-farms/3.jpg",
      "/images/farmlayou1.png",
      "/images/farmlayout-facility.png",
    ],
    videoUrl: "/videos/madurai-farms-tour.mp4",
    transportation: [
      { name: { en: "Madurai", ta: "மதுரை" }, distance: "45 km", time: "45 min" },
      { name: { en: "Kariyapatti", ta: "காரியாபட்டி" }, distance: "10 km", time: "10 min" },
      { name: { en: "Tiruppuvanam", ta: "திருப்புவனம்" }, distance: "15 km", time: "20 min" },
    ],
    hospitals: [
      { name: { en: "Sub-District Multi-Speciality Clinic", ta: "வட்டார மருத்துவமனை" }, distance: "3.5 km", time: "6 mins" },
      { name: { en: "Meenakshi Mission Hospital", ta: "மீனாட்சி மிஷன் மருத்துவமனை" }, distance: "15 km", time: "22 mins" },
    ],
    schoolsAndColleges: [
      { name: { en: "Agricultural Polytechnic & Research Center", ta: "வேளாண் பாலிடெக்னிக் & ஆராய்ச்சி மையம்" }, distance: "5.0 km", time: "8 mins" },
      { name: { en: "Madurai Kamaraj University Campus", ta: "மதுரை காமராஜர் பல்கலைக்கழகம்" }, distance: "14 km", time: "20 mins" },
    ],
    groundwater: {
      depth: { en: "30 – 38 ft Perennial Mountain Basin Aquifer", ta: "30 – 38 அடியில் வற்றாத மலை அடிவார நன்னீர்" },
      quality: { en: "100% Pure Sweet Potable Water (Tested TDS 140, Zero Salinity)", ta: "100% தூய சுவையான குடிநீர் (TDS 140, உப்புத்தன்மை அற்றது)" },
      source: { en: "Natural Mountain Spring Water Reservoir + Automated Drip Irrigation Lines", ta: "இயற்கை நீர்த்தேக்கம் + சொட்டு நீர் பாசன வசதி" },
    },
    neighborhood: {
      density: { en: "Peaceful Organic Farming & Weekend Retreat Sanctuary", ta: "அமைதியான இயற்கை வேளாண் பண்ணை & ஓய்வு விடுதி" },
      surrounding: { en: "Existing Organic Cottages, Mango/Guava Groves & Agro Landowners", ta: "மாந்தோப்புகள், கொய்யா தோப்புகள் மற்றும் வார இறுதி பங்களாக்கள்" },
      atmosphere: { en: "Scenic Mountain Panorama, Fresh Air & Zero Industrial Pollution", ta: "மலைக் காட்சி, தூய்மையான காற்று மற்றும் மாசற்ற சூழல்" },
    },
    groundValue: {
      currentRate: { en: "₹3.8 Lakhs / Cent (Quarter / Half / 1 Acre Parcels)", ta: "₹3.8 லட்சம் / சென்ட் (கால் / அரை / 1 ஏக்கர் நிலங்கள்)" },
      guidelineValue: { en: "Govt Guideline: ₹2.4 Lakhs / Cent", ta: "அரசு வழிகாட்டி மதிப்பு: ₹2.4 லட்சம் / சென்ட்" },
    },
    futurePrediction: {
      threeYearROI: "+40% Agro Capital Appreciation + Annual Harvest Yield",
      fiveYearROI: "+82% Overall Land Valuation Growth",
      drivers: {
        en: [
          "Surging demand for organic managed agro-acreage & farmstay living",
          "Direct scenic highway connectivity to Madurai ring road",
          "100% tax-free agricultural income & weekend cottage rental yield",
        ],
        ta: [
          "இயற்கை விவசாய பண்ணை நிலங்களின் அதீத தேவை மற்றும் ஓய்வு இல்ல வாழ்க்கை",
          "மதுரை வெளிவட்ட சாலையிலிருந்து விரைவு இணைப்பு",
          "100% வரிவிலக்கு பெற்ற விவசாய வருமானம் & வார இறுதி வாடகை வருவாய்",
        ],
      },
    },
    customerReviews: [
      {
        name: "Er. V. Sundarrajan",
        role: { en: "Bangalore Tech Lead (Owns 50 Cents)", ta: "பண்ணை நில உரிமையாளர் (50 சென்ட்)" },
        rating: 5,
        date: "October 2026",
        comment: {
          en: "We built our weekend farm cottage here. The sweet water table at 30ft and pre-planted fruit trees make this our family's greatest happiness. Surya team manages irrigation flawlessly.",
          ta: "இங்கு 50 சென்ட் வாங்கி பண்ணை வீடு கட்டியுள்ளோம். 30 அடியில் தேன் போன்ற குடிநீர் மற்றும் மாந்தோப்பு எங்கள் குடும்பத்திற்கு அளவற்ற மகிழ்ச்சி. சூர்யா குழுவினர் சிறப்பாக பராமரிக்கின்றனர்.",
        },
      },
      {
        name: "Dr. A. Alagarsamy",
        role: { en: "Retired Professor & Agro Enthusiast", ta: "ஓய்வுபெற்ற பேராசிரியர்" },
        rating: 5,
        date: "August 2026",
        comment: {
          en: "Water is crystal sweet and soil is rich red loam. Best long-term generational wealth asset for our children with 100% computer patta.",
          ta: "நீர் மிக இனிமையாகவும் செம்மண் வளமாகவும் உள்ளது. எங்கள் குழந்தைகளுக்கு 100% கணினி பட்டாவுடன் கூடிய தலைமுறை சொத்து.",
        },
      },
    ],
  },

};

// Aliases for slug matching across components
PROJECT_DETAILS_MAP["vaigai-elite-garden"] = PROJECT_DETAILS_MAP["vaigai-elite"];
PROJECT_DETAILS_MAP["vaigai-river-build"] = PROJECT_DETAILS_MAP["vaigai-river"];
PROJECT_DETAILS_MAP["pandi-kovil-site"] = PROJECT_DETAILS_MAP["pandi-kovil"];
