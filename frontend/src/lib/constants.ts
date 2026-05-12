export const SITE_NAME = "Lưu Trữ";
export const SITE_SLOGAN = "Đồ độc - Giá hời - Giao nhanh";
export const SITE_DESCRIPTION =
  "Chợ đồ Local Brand & Secondhand hàng đầu Việt Nam. Chuyên áo thun local brand, đồ secondhand Nhật Bản, Hàn Quốc, phụ kiện thời trang giá rẻ cho sinh viên.";

export const BRAND_VALUES = [
  {
    icon: "Sparkles",
    title: "Local Brand Chuẩn",
    description:
      "Hàng trăm local brand Việt Nam chính hãng, thiết kế độc đáo, chất lượng cao",
  },
  {
    icon: "Package",
    title: "Secondhand Nhập Khẩu",
    description:
      "Đồ secondhand Nhật Bản, Hàn Quốc, Châu Âu chất lượng tốt, giá chỉ từ 50K",
  },
  {
    icon: "GraduationCap",
    title: "Giá Sinh Viên",
    description:
      "Sản phẩm đa dạng từ 20K-500K, phù hợp túi tiền học sinh, sinh viên",
  },
  {
    icon: "Bot",
    title: "AI Gợi Ý Thông Minh",
    description:
      "AI phân tích sở thích, gợi ý đồ phù hợp với phong cách và ngân sách của bạn",
  },
  {
    icon: "Zap",
    title: "Giao Nhanh Nội Thành",
    description:
      "Giao hàng trong 2 giờ tại TP.HCM, Hà Nội. Miễn phí giao cho đơn từ 150K",
  },
  {
    icon: "Recycle",
    title: "Thời Trang Bền Vững",
    description:
      "Ủng hộ thời trang tuần hoàn, giảm rác thải, bảo vệ môi trường",
  },
];

export const NAVIGATION_ITEMS = [
  { label: "Trang chủ", href: "/", icon: "Home" },
  { label: "Flash Sale", href: "/flash-sale", icon: "Zap" },
  { label: "Local Brand", href: "/category/local-brand", icon: "Shirt" },
  { label: "Secondhand", href: "/category/secondhand", icon: "Package" },
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
    name: "Local Brand",
    slug: "local-brand",
    icon: "Shirt",
    children: [
      "Áo thun local brand",
      "Hoodie local brand",
      "Túi tote local brand",
      "Phụ kiện local brand",
    ],
  },
  {
    id: "cat-2",
    name: "Secondhand Nhập Khẩu",
    slug: "secondhand",
    icon: "Package",
    children: [
      "Secondhand Nhật",
      "Secondhand Hàn Quốc",
      "Secondhand Châu Âu",
      "Vintage độc lạ",
    ],
  },
  {
    id: "cat-3",
    name: "Thời trang nam",
    slug: "thoi-trang-nam",
    icon: "Shirt",
    children: ["Áo sơ mi", "Quần jean", "Áo khoác", "Giày thể thao"],
  },
  {
    id: "cat-4",
    name: "Thời trang nữ",
    slug: "thoi-trang-nu",
    icon: "Dress",
    children: ["Đầm", "Chân váy", "Áo blouse", "Túi xách"],
  },
  {
    id: "cat-5",
    name: "Điện thoại & Phụ kiện",
    slug: "dien-thoai",
    icon: "Smartphone",
    children: ["Điện thoại", "Ốp lưng", "Sạc dự phòng", "Tai nghe"],
  },
  {
    id: "cat-6",
    name: "Máy tính & Laptop",
    slug: "may-tinh",
    icon: "Monitor",
    children: ["Laptop", "Màn hình", "Bàn phím", "Chuột"],
  },
  {
    id: "cat-7",
    name: "Đồ gia dụng",
    slug: "do-gia-dung",
    icon: "Home",
    children: ["Nồi cơm", "Máy lọc nước", "Quạt điện", "Máy hút bụi"],
  },
  {
    id: "cat-8",
    name: "Sách & Văn phòng",
    slug: "sach-van-phong",
    icon: "BookOpen",
    children: ["Sách kinh tế", "Sách văn học", "Dụng cụ học tập"],
  },
  {
    id: "cat-9",
    name: "Thể thao & Du lịch",
    slug: "the-thao",
    icon: "Trophy",
    children: ["Dụng cụ gym", "Xe đạp", "Vali", "Ba lô"],
  },
  {
    id: "cat-10",
    name: "Làm đẹp & Sức khỏe",
    slug: "lam-dep",
    icon: "Sparkles",
    children: ["Mỹ phẩm", "Chăm sóc da", "Nước hoa", "Thực phẩm chức năng"],
  },
];

export const BANNERS = [
  {
    id: "banner-1",
    title: "Local Brand Việt Nam",
    subtitle: "Áo thun, hoodie, phụ kiện từ các thương hiệu Việt",
    image: "/images/banners/banner-1.jpg",
    link: "/category/local-brand",
    color: "from-red-600 to-red-800",
  },
  {
    id: "banner-2",
    title: "Secondhand Nhập Khẩu",
    subtitle: "Đồ Nhật Bản, Hàn Quốc chất lượng cao - Giá chỉ từ 50K",
    image: "/images/banners/banner-2.jpg",
    link: "/category/secondhand",
    color: "from-purple-600 to-purple-800",
  },
  {
    id: "banner-3",
    title: "Sinh Viên Mua Sắm",
    subtitle: "Hàng ngàn sản phẩm giá rẻ từ 20K - 500K cho sinh viên",
    image: "/images/banners/banner-3.jpg",
    link: "/flash-sale",
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