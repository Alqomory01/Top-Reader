const DB_KEY = 'topreader_db_v2';

const DB = {
  init() {
    if (!localStorage.getItem(DB_KEY)) {
      const seed = {
        publications: [
          {
            id: 'PUB-001',
            // ── AUTHOR FIELDS (no pricing — press sets all amounts) ──
            title: 'Language Policy & Identity',
            subtitle: 'A Comparative African Study',
            source_title: 'African Linguistics Series Vol. 3',
            author: 'B. Owusu',
            authorId: 'AUTH-0044',
            faculty: 'Arts',
            department: 'Linguistics',
            category: 'Linguistics',
            accessModel: 'Open Access',
            description: 'An exploration of how language policy shapes national identity across post-colonial African states.',
            keywords: 'language, identity, policy, Africa, post-colonial',
            coAuthors: [],
            // ── PRESS FIELDS ──
            press_catalog_id: 'ULP-LIN-0044',
            isbn: '978-000-1161',
            press_faculty: 'Arts & Humanities',
            press_department: 'Linguistics',
            press_description: 'Peer-reviewed scholarly exploration of post-colonial African language policy.',
            total_num_pages: 312,
            table_of_content: 'Ch 1: Introduction\nCh 2: Historical Context\nCh 3: Policy Frameworks\nCh 4: Case Studies\nCh 5: Conclusions',
            publisher: 'University of Lagos Press',
            publication_date: '2026-08-01',
            edition: '1st Edition',
            format: 'EPUB',
            file_size: '4.2 MB',
            drm: true,
            cover_image: '',
            original_publication: '2026',
            author_amount: 2800,        // set by press
            press_amount: 1200,         // set by press
            accumulated_amount: 4000,   // author_amount + press_amount, sent to bookshop
            pressNotes: 'Excellent peer-review scores. Ready for distribution.',
            // ── BOOKSHOP FIELDS ──
            bookshop_catalog_id: '',
            language: '',
            bs_keywords: '',
            identifiers: '',
            genre: '',
            categories: '',
            age_range: '',
            reading_level: '',
            rights: '',
            review_quotes: '',
            awards: '',
            bookshop_amount: null,
            final_sales_price: null,
            discount_percent: 0,        // % off final_sales_price, set/adjusted by bookshop anytime
            bookshopNotes: '',
            // ── STATUS ──
            status: 'press_approved',
            submittedAt: new Date(Date.now() - 1000*60*60*48).toISOString(),
            pressReviewedAt: new Date(Date.now() - 1000*60*60*24).toISOString(),
            publishedAt: null,
          },
          {
            id: 'PUB-002',
            title: 'Digital Pedagogy in African HE',
            subtitle: '',
            source_title: 'Education Futures Africa',
            author: 'F. Eze',
            authorId: 'AUTH-0058',
            faculty: 'Education',
            department: 'Education',
            category: 'Education',
            accessModel: 'Paid',
            description: 'A comprehensive exploration of digital pedagogical practices across African higher education institutions.',
            keywords: 'digital, pedagogy, HE, Africa, blended learning',
            coAuthors: [],
            press_catalog_id: '',
            isbn: '',
            press_faculty: '',
            press_department: '',
            press_description: '',
            total_num_pages: null,
            table_of_content: '',
            publisher: '',
            publication_date: '',
            edition: '',
            format: '',
            file_size: '',
            drm: true,
            cover_image: '',
            original_publication: '',
            author_amount: null,        // set by press on approval
            press_amount: null,         // set by press on approval
            accumulated_amount: null,   // calculated on approval
            pressNotes: '',
            bookshop_catalog_id: '',
            language: '',
            bs_keywords: '',
            identifiers: '',
            genre: '',
            categories: '',
            age_range: '',
            reading_level: '',
            rights: '',
            review_quotes: '',
            awards: '',
            bookshop_amount: null,
            final_sales_price: null,
            discount_percent: 0,
            bookshopNotes: '',
            status: 'press_review',
            submittedAt: new Date(Date.now() - 1000*60*60*72).toISOString(),
            pressReviewedAt: null,
            publishedAt: null,
          }
        ],
        nextId: 3,
      };
      localStorage.setItem(DB_KEY, JSON.stringify(seed));
    }
  },

  _get() { return JSON.parse(localStorage.getItem(DB_KEY)); },
  _save(data) { localStorage.setItem(DB_KEY, JSON.stringify(data)); },

  submitPublication(payload) {
    const data = this._get();
    const pub = {
      id: `PUB-${String(data.nextId).padStart(3, '0')}`,
      ...payload,
      // Press fields — all blank until press fills them in on approval
      press_catalog_id: '', isbn: '', press_faculty: '', press_department: '',
      press_description: '', total_num_pages: null, table_of_content: '',
      publisher: '', publication_date: '', edition: '', format: '', file_size: '',
      drm: true, cover_image: '', original_publication: '',
      author_amount: null,      // press sets this
      press_amount: null,       // press sets this
      accumulated_amount: null, // auto-calculated on approval
      pressNotes: '',
      // Bookshop fields — blank until bookshop fills in
      bookshop_catalog_id: '', language: '', bs_keywords: '', identifiers: '',
      genre: '', categories: '', age_range: '', reading_level: '', rights: '',
      review_quotes: '', awards: '', bookshop_amount: null, final_sales_price: null,
      discount_percent: 0, bookshopNotes: '',
      status: 'author_pending',
      submittedAt: new Date().toISOString(),
      pressReviewedAt: null,
      publishedAt: null,
    };
    data.publications.push(pub);
    data.nextId++;
    this._save(data);
    return pub;
  },

  getPublications(filter = null) {
    const data = this._get();
    if (!filter) return data.publications;
    return data.publications.filter(p => p.status === filter);
  },

  getPub(id) { return this._get().publications.find(p => p.id === id); },

  pressApprove(id, pressFields) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub) {
      Object.assign(pub, pressFields);
      // Accumulated = author_amount (set by press) + press_amount
      pub.accumulated_amount = (Number(pressFields.author_amount) || 0) + (Number(pressFields.press_amount) || 0);
      pub.status = 'press_approved';
      pub.pressReviewedAt = new Date().toISOString();
    }
    this._save(data);
    return pub;
  },

  pressReject(id, notes) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub) { pub.status = 'rejected'; pub.pressNotes = notes || ''; pub.pressReviewedAt = new Date().toISOString(); }
    this._save(data);
    return pub;
  },

  pressStartReview(id) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub && pub.status === 'author_pending') pub.status = 'press_review';
    this._save(data);
    return pub;
  },

  bookshopPublish(id, bsFields) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub) {
      Object.assign(pub, bsFields);
      if (pub.discount_percent == null) pub.discount_percent = 0;
      pub.status = 'bookshop_live';
      pub.publishedAt = new Date().toISOString();
    }
    this._save(data);
    return pub;
  },

  bookshopReject(id, notes) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub) { pub.status = 'press_review'; pub.bookshopNotes = notes || ''; }
    this._save(data);
    return pub;
  },

  // Bookshop sets/adjusts the discount (% off final_sales_price) at any time
  // for a live title. Original amounts are never overwritten — the discount
  // is layered on top and applied proportionally across all three shares.
  bookshopSetDiscount(id, percent) {
    const data = this._get();
    const pub = data.publications.find(p => p.id === id);
    if (pub) {
      let d = Number(percent);
      if (isNaN(d) || d < 0) d = 0;
      if (d > 100) d = 100;
      pub.discount_percent = d;
    }
    this._save(data);
    return pub;
  },

  // Returns the full pricing breakdown for a publication, including the
  // discount-adjusted ("effective") figures. Nothing here is persisted —
  // it's computed fresh from author_amount / press_amount / bookshop_amount /
  // final_sales_price / discount_percent every time it's called, so changing
  // the discount later never loses the original baseline numbers.
  getPricing(pub) {
    const author   = Number(pub.author_amount)   || 0;
    const press    = Number(pub.press_amount)    || 0;
    const bookshop = Number(pub.bookshop_amount) || 0;
    const fullPrice = Number(pub.final_sales_price) || 0;
    const discount  = Number(pub.discount_percent) || 0;
    const factor = 1 - (discount / 100);
    const round2 = n => Math.round(n * 100) / 100;
    return {
      author, press, bookshop, fullPrice, discount,
      effectivePrice:  round2(fullPrice * factor),
      effectiveAuthor: round2(author * factor),
      effectivePress:  round2(press * factor),
      effectiveBookshop: round2(bookshop * factor),
    };
  },

  statusLabel(status) {
    return {
      author_pending: 'Pending Publisher Review',
      press_review:   'Editorial Review in Progress',
      press_approved: 'Published',
      bookshop_live:  'In Sales',
      rejected:       'Rejected',
    }[status] || status;
  },

  timeAgo(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  },
};

DB.init();