import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Heart,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  User,
  X,
} from 'lucide-react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

type Product = {
  id: string
  name: string
  collection: string
  family: 'Floral' | 'Woody' | 'Citrus' | 'Amber' | 'Aquatic'
  concentration: 'Eau de Parfum' | 'Parfum' | 'Extrait'
  occasion: 'Day' | 'Night' | 'Gift' | 'Travel'
  size: string[]
  price: number
  rating: number
  image: string
  notes: { top: string[]; heart: string[]; base: string[] }
  accords: string[]
  description: string
  badge?: string
}

type CartItem = {
  id: string
  size: string
  quantity: number
}

const formatIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const products: Product[] = [
  {
    id: 'velvet-rain',
    name: 'Velvet Rain',
    collection: 'Monsoon Atelier',
    family: 'Floral',
    concentration: 'Eau de Parfum',
    occasion: 'Day',
    size: ['30ml', '50ml', '100ml'],
    price: 1280000,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['bergamot', 'dew pear', 'pink pepper'],
      heart: ['jasmine sambac', 'iris mist', 'magnolia'],
      base: ['white musk', 'cedar skin', 'soft amber'],
    },
    accords: ['dewy', 'powdery', 'clean floral'],
    description:
      'A quiet floral with the polished freshness of first rain on warm stone, made for long Jakarta afternoons.',
    badge: 'Best seller',
  },
  {
    id: 'santal-jakarta',
    name: 'Santal Jakarta',
    collection: 'City Woods',
    family: 'Woody',
    concentration: 'Parfum',
    occasion: 'Night',
    size: ['50ml', '100ml'],
    price: 1750000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['cardamom', 'mandarin leaf', 'black tea'],
      heart: ['sandalwood', 'orris', 'smoked fig'],
      base: ['vetiver', 'suede', 'tonka'],
    },
    accords: ['creamy wood', 'smoked tea', 'suede'],
    description:
      'Creamy sandalwood and black tea shaped into a tailored evening signature with a little heat.',
    badge: 'New',
  },
  {
    id: 'citrus-archive',
    name: 'Citrus Archive',
    collection: 'Solar Notes',
    family: 'Citrus',
    concentration: 'Eau de Parfum',
    occasion: 'Day',
    size: ['30ml', '50ml'],
    price: 980000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['yuzu', 'lime blossom', 'green mango'],
      heart: ['neroli', 'ginger flower', 'mint leaf'],
      base: ['ambrette', 'blond woods', 'salt musk'],
    },
    accords: ['bright citrus', 'green', 'mineral'],
    description:
      'A crisp, luminous citrus fragrance with a green Indonesian edge and a dry mineral finish.',
  },
  {
    id: 'amber-nocturne',
    name: 'Amber Nocturne',
    collection: 'After Dark',
    family: 'Amber',
    concentration: 'Extrait',
    occasion: 'Night',
    size: ['30ml', '50ml'],
    price: 2200000,
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['saffron', 'cinnamon bark', 'plum'],
      heart: ['labdanum', 'rose absolute', 'cacao'],
      base: ['amber resin', 'oud trace', 'vanilla smoke'],
    },
    accords: ['resinous', 'spiced', 'velvet amber'],
    description:
      'A deep extrait built for night air, with resin, spice, and a slow glowing trail.',
    badge: 'Limited',
  },
  {
    id: 'fig-reverie',
    name: 'Fig Reverie',
    collection: 'Botanical Modern',
    family: 'Woody',
    concentration: 'Eau de Parfum',
    occasion: 'Gift',
    size: ['50ml', '100ml'],
    price: 1450000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['fig leaf', 'coconut water', 'bergamot'],
      heart: ['green fig', 'violet', 'tea rose'],
      base: ['cashmere wood', 'musk', 'orris'],
    },
    accords: ['green fig', 'milky wood', 'soft musk'],
    description:
      'Elegant green fig with a creamy wood base, wrapped as the easiest luxury gift in the line.',
  },
  {
    id: 'musk-atlas',
    name: 'Musk Atlas',
    collection: 'Skin Library',
    family: 'Aquatic',
    concentration: 'Parfum',
    occasion: 'Travel',
    size: ['10ml', '30ml', '50ml'],
    price: 860000,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1608528577891-eb055944f2e2?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['sea salt', 'aldehydes', 'lemon zest'],
      heart: ['rice steam', 'white tea', 'lotus'],
      base: ['skin musk', 'ambergris accord', 'driftwood'],
    },
    accords: ['skin scent', 'salt air', 'white tea'],
    description:
      'A close, clean scent that wears like fresh linen after a coastal morning.',
  },
]

const navGroups = [
  {
    title: 'Fragrance',
    links: ['Genderless', 'Floral', 'Woody', 'Citrus', 'Amber', 'Discovery Sets', 'Best Sellers', 'New Arrivals'],
  },
  {
    title: 'Collections',
    links: ['Monsoon Atelier', 'City Woods', 'Solar Notes', 'After Dark', 'Skin Library'],
  },
  { title: 'Gifts', links: ['Gift Sets', 'Under Rp1.000.000', 'Travel Sprays', 'Personal Engraving'] },
  { title: 'Journal', links: ['Scent Notes', 'Layering Guide', 'Atelier Stories'] },
]

function getStored<T>(key: string, fallback: T) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => getStored('maison-cart', []))
  const [wishlist, setWishlist] = useState<string[]>(() => getStored('maison-wishlist', []))
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => localStorage.setItem('maison-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('maison-wishlist', JSON.stringify(wishlist)), [wishlist])

  const addToCart = (id: string, size: string, quantity = 1) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === id && item.size === size)
      if (existing) {
        return items.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...items, { id, size, quantity }]
    })
    setCartOpen(true)
  }

  const updateCart = (id: string, size: string, quantity: number) => {
    setCart((items) =>
      quantity <= 0
        ? items.filter((item) => !(item.id === id && item.size === size))
        : items.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)),
    )
  }

  const toggleWishlist = (id: string) => {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))
  }

  const context = { cart, wishlist, addToCart, updateCart, toggleWishlist, setCartOpen }

  return (
    <div className="app-shell">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} openCart={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<Home {...context} />} />
        <Route path="/shop" element={<Shop {...context} />} />
        <Route path="/product/:id" element={<ProductDetail {...context} />} />
        <Route path="/cart" element={<CartPage {...context} />} />
        <Route path="/checkout" element={<Checkout cart={cart} updateCart={updateCart} />} />
        <Route path="/account" element={<Account wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/help" element={<Help />} />
      </Routes>
      <Footer />
      <CartDrawer open={cartOpen} close={() => setCartOpen(false)} cart={cart} updateCart={updateCart} />
    </div>
  )
}

function Header({ cartCount, openCart }: { cartCount: number; openCart: () => void }) {
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!megaRef.current) return
    gsap.to(megaRef.current, {
      autoAlpha: megaOpen ? 1 : 0,
      y: megaOpen ? 0 : -12,
      duration: 0.28,
      ease: 'power3.out',
      pointerEvents: megaOpen ? 'auto' : 'none',
    })
  }, [megaOpen])

  return (
    <header className="site-header">
      <div className="announcement">Complimentary Jakarta delivery over {formatIDR(1500000)} · Discovery set ships today</div>
      <nav className="nav-bar" aria-label="Primary navigation">
        <button className="icon-button mobile-only" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <Link to="/" className="brand" aria-label="Maison Elyra home">
          <span>Maison</span>
          <strong>Elyra</strong>
        </Link>
        <div className="desktop-nav" onMouseLeave={() => setMegaOpen(false)}>
          <button className="nav-link" onMouseEnter={() => setMegaOpen(true)} onClick={() => setMegaOpen((value) => !value)}>
            Fragrance <ChevronDown size={14} />
          </button>
          <NavLink to="/shop" className="nav-link">
            Collections
          </NavLink>
          <NavLink to="/journal" className="nav-link">
            Journal
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <div className="mega-menu" ref={megaRef}>
            <div className="mega-feature">
              <p className="eyebrow">Scent wardrobe</p>
              <h3>Build a signature around weather, skin, and mood.</h3>
              <Link to="/shop" className="text-link" onClick={() => setMegaOpen(false)}>
                Shop all perfume <ArrowRight size={16} />
              </Link>
            </div>
            {navGroups.map((group) => (
              <div key={group.title}>
                <h4>{group.title}</h4>
                {group.links.map((link) => (
                  <Link to="/shop" key={link} onClick={() => setMegaOpen(false)}>
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={19} />
          </button>
          <Link className="icon-button" to="/account" aria-label="Account">
            <User size={19} />
          </Link>
          <button className="icon-button cart-trigger" onClick={openCart} aria-label="Open cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="mobile-drawer">
          <div className="drawer-panel">
            <button className="icon-button close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
            <Link to="/" className="brand drawer-brand" onClick={() => setMobileOpen(false)}>
              <span>Maison</span>
              <strong>Elyra</strong>
            </Link>
            {navGroups.map((group) => (
              <details key={group.title} open={group.title === 'Fragrance'}>
                <summary>{group.title}</summary>
                {group.links.map((link) => (
                  <Link to="/shop" key={link} onClick={() => setMobileOpen(false)}>
                    {link}
                  </Link>
                ))}
              </details>
            ))}
            <Link to="/account" className="drawer-cta" onClick={() => setMobileOpen(false)}>
              Account and wishlist
            </Link>
          </div>
        </div>
      )}
      {searchOpen && <SearchOverlay close={() => setSearchOpen(false)} />}
    </header>
  )
}

function SearchOverlay({ close }: { close: () => void }) {
  const [term, setTerm] = useState('')
  const matches = products.filter((product) => `${product.name} ${product.family} ${product.collection}`.toLowerCase().includes(term.toLowerCase()))

  return (
    <div className="search-overlay">
      <div className="search-box">
        <button className="icon-button close" onClick={close} aria-label="Close search">
          <X size={20} />
        </button>
        <p className="eyebrow">Search the atelier</p>
        <input autoFocus placeholder="Try amber, jasmine, travel..." value={term} onChange={(event) => setTerm(event.target.value)} />
        <div className="search-results">
          {(term ? matches : products.slice(0, 3)).map((product) => (
            <Link to={`/product/${product.id}`} onClick={close} key={product.id}>
              <img src={product.image} alt="" />
              <span>{product.name}</span>
              <small>{formatIDR(product.price)}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Home({
  wishlist,
  addToCart,
  toggleWishlist,
}: {
  wishlist: string[]
  addToCart: (id: string, size: string, quantity?: number) => void
  toggleWishlist: (id: string) => void
}) {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!heroRef.current) return
    gsap.fromTo(
      heroRef.current.querySelectorAll('.hero-copy > *, .hero-card, .stat'),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' },
    )
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((item) => {
      gsap.fromTo(
        item,
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 84%' },
        },
      )
    })
  }, [])

  return (
    <main>
      <section className="hero-section" ref={heroRef}>
        <div className="hero-copy">
          <p className="eyebrow">Fine fragrance · Jakarta</p>
          <h1>Perfume shaped for humid light, skin, and evening air.</h1>
          <p>
            Maison Elyra creates modern extrait and eau de parfum compositions with Indonesian weather in mind:
            luminous openings, elegant diffusion, and a trail that stays close.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Shop fragrances <ArrowRight size={18} />
            </Link>
            <Link to="/journal" className="secondary-button">
              Read scent journal
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <img src={products[1].image} alt="Santal Jakarta perfume bottle" />
          <div>
            <span>New release</span>
            <strong>Santal Jakarta</strong>
            <small>Black tea, sandalwood, suede</small>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <strong>24h</strong>
            <span>Jakarta dispatch</span>
          </div>
          <div className="stat">
            <strong>6</strong>
            <span>Signature scents</span>
          </div>
          <div className="stat">
            <strong>3x</strong>
            <span>Complimentary samples</span>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Best sellers</p>
          <h2>Built like a wardrobe, not a shelf.</h2>
          <Link to="/shop" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={wishlist.includes(product.id)}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="scent-finder reveal">
        <div>
          <p className="eyebrow">Scent finder</p>
          <h2>Choose by atmosphere.</h2>
        </div>
        {['Rain-clean florals', 'Cream woods', 'Solar citrus', 'Amber nights'].map((item) => (
          <Link to="/shop" key={item}>
            {item} <ArrowRight size={16} />
          </Link>
        ))}
      </section>

      <section className="editorial-band reveal">
        <img src={products[3].image} alt="Amber Nocturne perfume" />
        <div>
          <p className="eyebrow">Gifting</p>
          <h2>Wrapped in black rice paper, sealed with a scent card.</h2>
          <p>
            Gift sets include custom notes, discovery pairings, and elevated packaging ready for birthdays, weddings,
            Eid visits, and client gestures.
          </p>
          <Link className="primary-button" to="/shop">
            Explore gifts <Sparkles size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}

function ProductCard({
  product,
  wished,
  toggleWishlist,
  addToCart,
}: {
  product: Product
  wished: boolean
  toggleWishlist: (id: string) => void
  addToCart: (id: string, size: string, quantity?: number) => void
}) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image">
        {product.badge && <span className="badge">{product.badge}</span>}
        <img src={product.image} alt={`${product.name} perfume bottle`} />
      </Link>
      <div className="product-info">
        <div>
          <p>{product.collection}</p>
          <h3>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span>{product.family} · {product.concentration}</span>
        </div>
        <button className={`wish-button ${wished ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
          <Heart size={18} />
        </button>
      </div>
      <div className="product-bottom">
        <strong>{formatIDR(product.price)}</strong>
        <button onClick={() => addToCart(product.id, product.size[0])}>Add</button>
      </div>
    </article>
  )
}

function Shop({
  wishlist,
  addToCart,
  toggleWishlist,
}: {
  wishlist: string[]
  addToCart: (id: string, size: string, quantity?: number) => void
  toggleWishlist: (id: string) => void
}) {
  const [family, setFamily] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [maxPrice, setMaxPrice] = useState(2500000)
  const families = ['All', 'Floral', 'Woody', 'Citrus', 'Amber', 'Aquatic']
  const filtered = useMemo(() => {
    const list = products.filter((product) => (family === 'All' || product.family === family) && product.price <= maxPrice)
    return [...list].sort((a, b) => {
      if (sort === 'Price low') return a.price - b.price
      if (sort === 'Price high') return b.price - a.price
      if (sort === 'Rating') return b.rating - a.rating
      return Number(Boolean(b.badge)) - Number(Boolean(a.badge))
    })
  }, [family, sort, maxPrice])

  return (
    <main className="shop-page">
      <section className="page-hero compact">
        <p className="eyebrow">Fragrance wardrobe</p>
        <h1>Shop modern perfume by family, mood, and occasion.</h1>
      </section>
      <section className="shop-layout">
        <aside className="filters">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <strong>Filters</strong>
          </div>
          <label>
            Scent family
            <div className="chip-list">
              {families.map((item) => (
                <button className={family === item ? 'active' : ''} key={item} onClick={() => setFamily(item)}>
                  {item}
                </button>
              ))}
            </div>
          </label>
          <label>
            Maximum price
            <input type="range" min="800000" max="2500000" step="100000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <span>{formatIDR(maxPrice)}</span>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Featured</option>
              <option>Price low</option>
              <option>Price high</option>
              <option>Rating</option>
            </select>
          </label>
        </aside>
        <div>
          <div className="listing-bar">
            <span>{filtered.length} fragrances</span>
            <span>Complimentary samples with every order</span>
          </div>
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlist.includes(product.id)}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function ProductDetail({
  wishlist,
  addToCart,
  toggleWishlist,
}: {
  wishlist: string[]
  addToCart: (id: string, size: string, quantity?: number) => void
  toggleWishlist: (id: string) => void
}) {
  const { id } = useParams()
  const product = products.find((item) => item.id === id) ?? products[0]
  const [size, setSize] = useState(product.size[0])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    gsap.fromTo('.detail-gallery img, .detail-copy > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' })
  }, [product.id])

  return (
    <main className="detail-page">
      <section className="detail-grid">
        <div className="detail-gallery">
          <img src={product.image} alt={`${product.name} bottle`} />
          <div className="gallery-thumbs">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.collection}</p>
          <h1>{product.name}</h1>
          <div className="rating">
            <Star size={17} fill="currentColor" /> {product.rating.toFixed(1)} · {product.concentration}
          </div>
          <p>{product.description}</p>
          <div className="accords">
            {product.accords.map((accord) => (
              <span key={accord}>{accord}</span>
            ))}
          </div>
          <div className="size-picker">
            <strong>Choose size</strong>
            <div>
              {product.size.map((item) => (
                <button className={size === item ? 'active' : ''} onClick={() => setSize(item)} key={item}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="quantity-row">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>
              <Plus size={16} />
            </button>
          </div>
          <div className="purchase-row">
            <button className="primary-button" onClick={() => addToCart(product.id, size, quantity)}>
              Add to cart · {formatIDR(product.price)}
            </button>
            <button className={`secondary-button square ${wishlist.includes(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
              <Heart size={19} />
            </button>
          </div>
          <div className="notes-pyramid">
            {Object.entries(product.notes).map(([level, notes]) => (
              <div key={level}>
                <strong>{level}</strong>
                <span>{notes.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Pairs beautifully with</p>
          <h2>Complete the ritual.</h2>
        </div>
        <div className="product-grid">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => (
            <ProductCard key={item.id} product={item} wished={wishlist.includes(item.id)} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </main>
  )
}

function CartDrawer({
  open,
  close,
  cart,
  updateCart,
}: {
  open: boolean
  close: () => void
  cart: CartItem[]
  updateCart: (id: string, size: string, quantity: number) => void
}) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!drawerRef.current) return
    gsap.to(drawerRef.current, { x: open ? 0 : '105%', duration: 0.34, ease: 'power3.out' })
  }, [open])

  return (
    <div className={`cart-layer ${open ? 'visible' : ''}`}>
      <button className="cart-scrim" onClick={close} aria-label="Close cart"></button>
      <aside className="cart-drawer" ref={drawerRef}>
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Your cart</p>
            <h2>{cart.length ? 'A beautiful order.' : 'Cart is waiting.'}</h2>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>
        <CartItems cart={cart} updateCart={updateCart} />
        <CartSummary cart={cart} />
        <Link to="/checkout" className="primary-button full" onClick={close}>
          Checkout <CreditCard size={18} />
        </Link>
      </aside>
    </div>
  )
}

function CartItems({ cart, updateCart }: { cart: CartItem[]; updateCart: (id: string, size: string, quantity: number) => void }) {
  if (!cart.length) return <div className="empty-state">Add a fragrance and your samples will appear here.</div>

  return (
    <div className="cart-items">
      {cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id)!
        return (
          <div className="cart-item" key={`${item.id}-${item.size}`}>
            <img src={product.image} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span>{item.size} · {formatIDR(product.price)}</span>
              <div className="quantity-row small">
                <button onClick={() => updateCart(item.id, item.size, item.quantity - 1)}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateCart(item.id, item.size, item.quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function totals(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id)!.price * item.quantity, 0)
  const shipping = subtotal > 1500000 || subtotal === 0 ? 0 : 75000
  return { subtotal, shipping, total: subtotal + shipping }
}

function CartSummary({ cart }: { cart: CartItem[] }) {
  const value = totals(cart)
  return (
    <div className="summary-box">
      <div>
        <span>Subtotal</span>
        <strong>{formatIDR(value.subtotal)}</strong>
      </div>
      <div>
        <span>Shipping estimate</span>
        <strong>{value.shipping ? formatIDR(value.shipping) : 'Complimentary'}</strong>
      </div>
      <div>
        <span>Total</span>
        <strong>{formatIDR(value.total)}</strong>
      </div>
    </div>
  )
}

function CartPage({ cart, updateCart }: { cart: CartItem[]; updateCart: (id: string, size: string, quantity: number) => void }) {
  return (
    <main className="utility-page">
      <section className="page-hero compact">
        <p className="eyebrow">Shopping bag</p>
        <h1>Review your fragrance order.</h1>
      </section>
      <div className="utility-grid">
        <CartItems cart={cart} updateCart={updateCart} />
        <div>
          <input className="promo-input" placeholder="Promo code" />
          <CartSummary cart={cart} />
          <Link className="primary-button full" to="/checkout">
            Continue to checkout
          </Link>
        </div>
      </div>
    </main>
  )
}

function Checkout({ cart, updateCart }: { cart: CartItem[]; updateCart: (id: string, size: string, quantity: number) => void }) {
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(false)

  if (placed) {
    return (
      <main className="utility-page confirmation">
        <PackageCheck size={54} />
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you. Your Maison Elyra ritual is being prepared.</h1>
        <p>Mock order ME-260524 will dispatch from Jakarta within 24 hours.</p>
        <button className="primary-button" onClick={() => navigate('/account')}>
          View order
        </button>
      </main>
    )
  }

  return (
    <main className="utility-page">
      <section className="page-hero compact">
        <p className="eyebrow">Secure checkout</p>
        <h1>Delivery, payment, and final review.</h1>
      </section>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setPlaced(true) }}>
          <fieldset>
            <legend>Contact</legend>
            <input required placeholder="Email address" type="email" />
            <input required placeholder="Full name" />
            <input required placeholder="Phone number" />
          </fieldset>
          <fieldset>
            <legend>Shipping</legend>
            <input required placeholder="Address" />
            <div className="two-col">
              <input required placeholder="City" defaultValue="Jakarta" />
              <input required placeholder="Postal code" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <label className="radio-card">
              <input type="radio" defaultChecked name="payment" /> Credit card
            </label>
            <label className="radio-card">
              <input type="radio" name="payment" /> Bank transfer
            </label>
            <label className="radio-card">
              <input type="radio" name="payment" /> E-wallet
            </label>
          </fieldset>
          <button className="primary-button full" disabled={!cart.length}>
            Place mock order
          </button>
        </form>
        <aside>
          <CartItems cart={cart} updateCart={updateCart} />
          <CartSummary cart={cart} />
        </aside>
      </div>
    </main>
  )
}

function Account({ wishlist, toggleWishlist }: { wishlist: string[]; toggleWishlist: (id: string) => void }) {
  return (
    <main className="utility-page">
      <section className="page-hero compact">
        <p className="eyebrow">Account</p>
        <h1>Your fragrance cabinet.</h1>
      </section>
      <div className="account-grid">
        <form className="auth-card">
          <h2>Sign in</h2>
          <input placeholder="Email" type="email" />
          <input placeholder="Password" type="password" />
          <button className="primary-button full" type="button">Sign in</button>
          <button className="secondary-button full" type="button">Create account</button>
        </form>
        <div className="orders-card">
          <h2>Recent orders</h2>
          <div className="order-line">
            <PackageCheck size={18} />
            <span>ME-260524</span>
            <strong>Preparing</strong>
          </div>
          <h2>Wishlist</h2>
          <div className="mini-products">
            {(wishlist.length ? products.filter((product) => wishlist.includes(product.id)) : products.slice(0, 2)).map((product) => (
              <button key={product.id} onClick={() => toggleWishlist(product.id)}>
                <img src={product.image} alt="" />
                <span>{product.name}</span>
                <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function About() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">The atelier</p>
        <h1>Luxury perfume composed for tropical city life.</h1>
        <p>Maison Elyra balances French structure with Indonesian climate awareness: bright openings, graceful projection, and ingredients that feel polished without becoming heavy.</p>
      </section>
      <section className="values-grid section">
        {[
          ['Weather-aware', 'Every composition is tested for humidity, heat, and close indoor spaces.'],
          ['Modern ritual', 'Packaging, refills, and samples are designed for daily use, not display only.'],
          ['Responsible pace', 'Small batch production keeps the collection focused and traceable.'],
        ].map(([title, copy]) => (
          <div key={title}>
            <ShieldCheck size={22} />
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

function Journal() {
  return (
    <main className="journal-page">
      <section className="page-hero compact">
        <p className="eyebrow">Journal</p>
        <h1>Scent notes, rituals, and atelier stories.</h1>
      </section>
      <section className="journal-grid">
        {[
          ['How to wear amber in warm weather', products[3].image],
          ['A simple guide to fragrance notes', products[0].image],
          ['Choosing a perfume gift without guessing', products[4].image],
        ].map(([title, image]) => (
          <article key={title}>
            <img src={image} alt="" />
            <p className="eyebrow">Guide</p>
            <h2>{title}</h2>
            <Link to="/journal" className="text-link">Read article <ArrowRight size={16} /></Link>
          </article>
        ))}
      </section>
    </main>
  )
}

function Help() {
  return (
    <main className="utility-page">
      <section className="page-hero compact">
        <p className="eyebrow">Help</p>
        <h1>Shipping, returns, and care.</h1>
      </section>
      <div className="faq-list">
        {['Jakarta orders usually dispatch within 24 hours.', 'Unopened perfume may be returned within 7 days.', 'Store bottles away from direct sunlight and heat.', 'Every order includes three complimentary samples.'].map((copy) => (
          <div key={copy}><Check size={18} /> {copy}</div>
        ))}
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/" className="brand">
          <span>Maison</span>
          <strong>Elyra</strong>
        </Link>
        <p>Modern fine fragrance for Indonesia. Front-end demo store.</p>
      </div>
      <div>
        <Link to="/shop">Shop</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/about">About</Link>
        <Link to="/help">Help</Link>
      </div>
      <form>
        <label>Private notes from the atelier</label>
        <div>
          <input placeholder="Email address" type="email" />
          <button type="button">Join</button>
        </div>
      </form>
    </footer>
  )
}

export default App
