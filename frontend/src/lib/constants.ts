export const SITE_NAME = "Lưu Trữ";
export const SITE_DESCRIPTION = "Mua sắm thông minh - Giá tốt mỗi ngày";

export const NAVIGATION_ITEMS = [
  { label: "Trang chủ", href: "/", icon: "Home" },
  { label: "Flash Sale", href: "/flash-sale", icon: "Zap" },
  { label: "Thời trang", href: "/category/thoi-trang", icon: "Shirt" },
  { label: "Điện tử", href: "/category/dien-tu", icon: "Monitor" },
  { label: "Đồ gia dụng", href: "/category/do-gia-dung", icon: "Home" },
  { label: "Sách", href: "/category/sach", icon: "BookOpen" },
  { label: "Thể thao", href: "/category/the-thao", icon: "Trophy" },
  { label: "Làm đẹp", href: "/category/lam-dep", icon: "Sparkles" },
];

export const CATEGORIES = [
  {
    id: "cat-1",
    name: "Thời trang nam",
    slug: "thoi-trang-nam",
    icon: "Shirt",
    children: ["Áo sơ mi", "Quần jean", "Áo khoác", "Giày thể thao"],
  },
  {
    id: "cat-2",
    name: "Thời trang nữ",
    slug: "thoi-trang-nu",
    icon: "Dress",
    children: ["Đầm", "Chân váy", "Áo blouse", "Túi xách"],
  },
  {
    id: "cat-3",
    name: "Điện thoại & Phụ kiện",
    slug: "dien-thoai",
    icon: "Smartphone",
    children: ["Điện thoại", "Ốp lưng", "Sạc dự phòng", "Tai nghe"],
  },
  {
    id: "cat-4",
    name: "Máy tính & Laptop",
    slug: "may-tinh",
    icon: "Monitor",
    children: ["Laptop", "Màn hình", "Bàn phím", "Chuột"],
  },
  {
    id: "cat-5",
    name: "Đồ gia dụng",
    slug: "do-gia-dung",
    icon: "Home",
    children: ["Nồi cơm", "Máy lọc nước", "Quạt điện", "Máy hút bụi"],
  },
  {
    id: "cat-6",
    name: "Sách & Văn phòng",
    slug: "sach-van-phong",
    icon: "BookOpen",
    children: ["Sách kinh tế", "Sách văn học", "Dụng cụ học tập"],
  },
  {
    id: "cat-7",
    name: "Thể thao & Du lịch",
    slug: "the-thao",
    icon: "Trophy",
    children: ["Dụng cụ gym", "Xe đạp", "Vali", "Ba lô"],
  },
  {
    id: "cat-8",
    name: "Làm đẹp & Sức khỏe",
    slug: "lam-dep",
    icon: "Sparkles",
    children: ["Mỹ phẩm", "Chăm sóc da", "Nước hoa", "Thực phẩm chức năng"],
  },
];

export const BANNERS = [
  {
    id: "banner-1",
    title: "Flash Sale Siêu Hời",
    subtitle: "Giảm đến 70% cho hàng ngàn sản phẩm",
    image: "/images/banners/banner-1.jpg",
    link: "/flash-sale",
    color: "from-red-600 to-red-800",
  },
  {
    id: "banner-2",
    title: "Bộ Sưu Tập Mới",
    subtitle: "Xu hướng thời trang Thu Đông 2024",
    image: "/images/banners/banner-2.jpg",
    link: "/category/thoi-trang",
    color: "from-purple-600 to-purple-800",
  },
  {
    id: "banner-3",
    title: "Điện Tử Gia Dụng",
    subtitle: "Công nghệ mới nhất - Giá tốt nhất",
    image: "/images/banners/banner-3.jpg",
    link: "/category/dien-tu",
    color: "from-blue-600 to-blue-800",
  },
];

export const FLASH_SALE_TIMER_HOURS = 23;
export const FLASH_SALE_TIMER_MINUTES = 59;
export const FLASH_SALE_TIMER_SECONDS = 59;

export const PRODUCTS_PER_PAGE = 20;
export const RECOMMENDED_PRODUCTS_COUNT = 10;
export const TRENDING_PRODUCTS_COUNT = 12;
export const FLASH_SALE_PRODUCTS_COUNT = 8;
