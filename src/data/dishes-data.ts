import type { Dish } from "../types/dish-types";

// 55 Vietnamese dishes with full metadata for filtering and deep links
export const DISHES: Dish[] = [
  // ── Existing dishes (updated with new fields) ──────────────────────────────
  {
    id: 1, name: "Phở Bò", description: "Món ăn quốc hồn quốc túy với nước dùng thanh ngọt, thịt bò mềm.",
    category: "Món Nước", time: ["Sáng", "Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Bắc", shopeeFoodKeyword: "phở bò",
  },
  {
    id: 2, name: "Bún Chả", description: "Thịt nướng thơm lừng ăn kèm bún, rau sống và nước chấm chua ngọt.",
    category: "Món Khô/Bún", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Bắc", shopeeFoodKeyword: "bún chả",
  },
  {
    id: 3, name: "Bánh Mì", description: "Bánh mì giòn rụm kẹp pate, chả lụa và đồ chua.",
    category: "Ăn Nhanh", time: ["Sáng", "Trưa", "Tối", "Khuya"],
    budget: "under-50k", dietary: [], region: "Nam", shopeeFoodKeyword: "bánh mì",
  },
  {
    id: 4, name: "Cơm Tấm", description: "Cơm tấm bì chả sườn nướng, rưới mỡ hành thơm ngậy.",
    category: "Món Cơm", time: ["Sáng", "Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "cơm tấm",
  },
  {
    id: 5, name: "Bún Đậu Mắm Tôm", description: "Sự kết hợp hoàn hảo giữa đậu rán giòn, bún lá và mắm tôm.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Bắc", shopeeFoodKeyword: "bún đậu mắm tôm",
  },
  {
    id: 6, name: "Bún Bò Huế", description: "Nước dùng cay nồng hương vị sả gừng, sợi bún to.",
    category: "Món Nước", time: ["Sáng", "Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Trung", shopeeFoodKeyword: "bún bò huế",
  },
  {
    id: 7, name: "Bánh Xèo", description: "Vỏ bánh vàng giòn, nhân tôm thịt giá đỗ.",
    category: "Đồ Chiên", time: ["Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "bánh xèo",
  },
  {
    id: 8, name: "Gỏi Cuốn", description: "Món cuốn thanh đạm với tôm thịt và rau sống.",
    category: "Khai Vị", time: ["Trưa", "Tối"],
    budget: "under-50k", dietary: [], region: "Nam", shopeeFoodKeyword: "gỏi cuốn",
  },
  {
    id: 10, name: "Xôi Xéo", description: "Xôi vàng óng, đậu xanh bùi bùi và hành phi.",
    category: "Ăn Sáng", time: ["Sáng"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Bắc", shopeeFoodKeyword: "xôi xéo",
  },
  {
    id: 11, name: "Hủ Tiếu Nam Vang", description: "Món nước đặc trưng với tôm, thịt băm và trứng cút.",
    category: "Món Nước", time: ["Sáng", "Tối", "Khuya"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "hủ tiếu nam vang",
  },
  {
    id: 12, name: "Bún Riêu Cua", description: "Vị chua thanh từ cà chua và béo ngậy từ riêu cua.",
    category: "Món Nước", time: ["Sáng", "Trưa"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Bắc", shopeeFoodKeyword: "bún riêu",
  },
  {
    id: 13, name: "Cơm Gà Hội An", description: "Cơm vàng óng, gà xé phay giòn ngon chuẩn vị miền Trung.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat", "no-seafood"], region: "Trung", shopeeFoodKeyword: "cơm gà hội an",
  },
  {
    id: 14, name: "Bún Thịt Nướng", description: "Thịt nướng vàng rộm, nem nướng giòn tan ăn kèm rau tươi.",
    category: "Món Khô", time: ["Sáng", "Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "bún thịt nướng",
  },
  {
    id: 15, name: "Bún Mắm", description: "Hương vị đậm đà của mắm cá linh, cá sặc miền Tây.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "bún mắm",
  },
  {
    id: 16, name: "Bánh Cuốn", description: "Vỏ bánh mỏng mướt nhân mộc nhĩ thịt băm.",
    category: "Ăn Sáng", time: ["Sáng", "Tối"],
    budget: "under-50k", dietary: [], region: "Bắc", shopeeFoodKeyword: "bánh cuốn",
  },

  // ── New dishes ─────────────────────────────────────────────────────────────
  {
    id: 17, name: "Phở Gà", description: "Nước dùng gà thanh ngọt, thịt gà xé mềm tan.",
    category: "Món Nước", time: ["Sáng", "Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat", "no-seafood"], region: "Bắc", shopeeFoodKeyword: "phở gà",
  },
  {
    id: 18, name: "Cháo Lòng", description: "Cháo trắng mềm mịn, lòng heo sạch thơm ngon.",
    category: "Ăn Sáng", time: ["Sáng", "Khuya"],
    budget: "under-50k", dietary: ["no-seafood"], region: "Nam", shopeeFoodKeyword: "cháo lòng",
  },
  {
    id: 19, name: "Bánh Ướt", description: "Bánh tráng ướt mềm dai, chấm nước mắm chua ngọt.",
    category: "Ăn Sáng", time: ["Sáng"],
    budget: "under-50k", dietary: [], region: "Trung", shopeeFoodKeyword: "bánh ướt",
  },
  {
    id: 20, name: "Xôi Gà", description: "Xôi dẻo thơm phủ gà xé, hành phi vàng ruộm.",
    category: "Ăn Sáng", time: ["Sáng"],
    budget: "under-50k", dietary: ["no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "xôi gà",
  },
  {
    id: 21, name: "Mì Quảng", description: "Sợi mì vàng to, nước lèo sánh đậm, bánh đa giòn.",
    category: "Món Nước", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Trung", shopeeFoodKeyword: "mì quảng",
  },
  {
    id: 22, name: "Cao Lầu", description: "Đặc sản Hội An, sợi mì vàng độc đáo, thịt xá xíu thơm.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Trung", shopeeFoodKeyword: "cao lầu",
  },
  {
    id: 23, name: "Cơm Chiên Dương Châu", description: "Cơm rang đơn giản nhưng đầy màu sắc, dễ ăn.",
    category: "Món Cơm", time: ["Trưa", "Tối", "Khuya"],
    budget: "50k-100k", dietary: [], region: "Mọi vùng", shopeeFoodKeyword: "cơm chiên dương châu",
  },
  {
    id: 24, name: "Cá Kho Tộ", description: "Cá kho đậm đà caramel, ăn với cơm trắng nóng.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Nam", shopeeFoodKeyword: "cá kho tộ",
  },
  {
    id: 25, name: "Canh Chua Cá", description: "Canh chua thanh dịu, cá tươi ngọt, me và cà chua.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Nam", shopeeFoodKeyword: "canh chua cá",
  },
  {
    id: 26, name: "Thịt Kho Hột Vịt", description: "Thịt ba chỉ kho nước dừa với trứng vịt béo thơm.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-seafood"], region: "Nam", shopeeFoodKeyword: "thịt kho hột vịt",
  },
  {
    id: 27, name: "Bún Bò Nam Bộ", description: "Bún thịt bò tái, đậu phộng rang, rau tươi đậm vị.",
    category: "Món Khô/Bún", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "bún bò nam bộ",
  },
  {
    id: 28, name: "Chả Cá Lã Vọng", description: "Chả cá lăng áp chảo nghệ, ăn kèm bún và mắm tôm.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "over-100k", dietary: ["no-red-meat"], region: "Bắc", shopeeFoodKeyword: "chả cá lã vọng",
  },
  {
    id: 29, name: "Lẩu Thái Hải Sản", description: "Nước lẩu chua cay đậm đà, hải sản tươi rói.",
    category: "Lẩu", time: ["Tối"],
    budget: "over-100k", dietary: ["no-red-meat"], region: "Mọi vùng", shopeeFoodKeyword: "lẩu thái hải sản",
  },
  {
    id: 30, name: "Lẩu Mắm", description: "Nước lẩu từ mắm cá đặc trưng miền Tây Nam Bộ.",
    category: "Lẩu", time: ["Tối"],
    budget: "over-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "lẩu mắm",
  },
  {
    id: 31, name: "Bánh Bèo", description: "Bánh bột gạo mềm mịn, chấm nước mắm ngọt.",
    category: "Ăn Vặt", time: ["Trưa", "Tối"],
    budget: "under-50k", dietary: [], region: "Trung", shopeeFoodKeyword: "bánh bèo",
  },
  {
    id: 32, name: "Nem Lụi", description: "Chả nem thơm lừng nướng trên than hoa, cuốn bánh tráng.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Trung", shopeeFoodKeyword: "nem lụi",
  },
  {
    id: 33, name: "Cơm Niêu Sài Gòn", description: "Cơm cháy giòn bùi ăn với các món ăn kèm đa dạng.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "cơm niêu",
  },
  {
    id: 34, name: "Bò Kho", description: "Bò kho sốt cà chua đậm đà, ăn với bánh mì hoặc bún.",
    category: "Món Cơm", time: ["Sáng", "Trưa"],
    budget: "50k-100k", dietary: ["no-seafood"], region: "Nam", shopeeFoodKeyword: "bò kho",
  },
  {
    id: 35, name: "Cháo Gà", description: "Cháo gà mềm mịn, thịt gà xé nhỏ thơm ngon.",
    category: "Ăn Sáng", time: ["Sáng", "Khuya"],
    budget: "under-50k", dietary: ["no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "cháo gà",
  },
  {
    id: 36, name: "Hủ Tiếu Khô", description: "Hủ tiếu trộn sốt, thịt băm giòn và tôm tươi.",
    category: "Món Nước", time: ["Sáng", "Trưa", "Khuya"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "hủ tiếu khô",
  },
  {
    id: 37, name: "Súp Cua", description: "Súp thanh ngọt từ cua, trứng và bắp.",
    category: "Khai Vị", time: ["Sáng", "Khuya"],
    budget: "under-50k", dietary: ["no-red-meat"], region: "Nam", shopeeFoodKeyword: "súp cua",
  },
  {
    id: 38, name: "Mì Xào Bò", description: "Mì xào giòn với bò tái, hành tây và rau cải.",
    category: "Món Khô", time: ["Trưa", "Tối", "Khuya"],
    budget: "50k-100k", dietary: [], region: "Mọi vùng", shopeeFoodKeyword: "mì xào bò",
  },
  {
    id: 39, name: "Gà Nướng Muối Ớt", description: "Gà nướng da giòn thơm, vị cay mặn đặc trưng.",
    category: "Món Nướng", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat", "no-seafood"], region: "Nam", shopeeFoodKeyword: "gà nướng muối ớt",
  },
  {
    id: 40, name: "Cơm Gà Xối Mỡ", description: "Gà chiên giòn xối mỡ, cơm trắng dẻo thơm.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat", "no-seafood"], region: "Nam", shopeeFoodKeyword: "cơm gà xối mỡ",
  },
  {
    id: 41, name: "Bánh Hỏi Thịt Nướng", description: "Bánh hỏi mỏng mịn cuộn thịt nướng thơm hành.",
    category: "Đặc Sản", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: [], region: "Nam", shopeeFoodKeyword: "bánh hỏi thịt nướng",
  },
  {
    id: 42, name: "Bún Cá", description: "Bún với cá chiên thơm, nước dùng thanh ngọt từ cá.",
    category: "Món Nước", time: ["Sáng", "Trưa"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Mọi vùng", shopeeFoodKeyword: "bún cá",
  },
  {
    id: 43, name: "Ốc Hút", description: "Ốc xào sả ớt cay nồng, hút là ghiền.",
    category: "Ăn Vặt", time: ["Tối", "Khuya"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Nam", shopeeFoodKeyword: "ốc hút",
  },
  {
    id: 44, name: "Sườn Chua Ngọt", description: "Sườn chiên giòn sốt chua ngọt, ăn kèm cơm trắng.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "sườn chua ngọt",
  },
  {
    id: 45, name: "Bánh Mì Ốp La", description: "Bánh mì giòn kẹp trứng ốp la, chả và nước tương.",
    category: "Ăn Nhanh", time: ["Sáng", "Khuya"],
    budget: "under-50k", dietary: [], region: "Nam", shopeeFoodKeyword: "bánh mì ốp la",
  },
  {
    id: 46, name: "Mì Tôm Trứng", description: "Tô mì tôm đêm khuya với trứng chiên, đơn giản mà ngon.",
    category: "Ăn Nhanh", time: ["Khuya"],
    budget: "under-50k", dietary: [], region: "Mọi vùng", shopeeFoodKeyword: "mì tôm",
  },
  {
    id: 47, name: "Chè Đậu Đỏ", description: "Chè đậu đỏ thanh ngọt, mát lành cho buổi chiều.",
    category: "Tráng Miệng", time: ["Tối", "Khuya"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "chè đậu đỏ",
  },
  {
    id: 48, name: "Cơm Chay", description: "Cơm chay đa dạng, đậu phụ và rau củ nấu thanh đạm.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "cơm chay",
  },
  {
    id: 49, name: "Bánh Mì Chay", description: "Bánh mì chay với đậu phụ chiên, chả chay và đồ chua.",
    category: "Ăn Nhanh", time: ["Sáng", "Trưa"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "bánh mì chay",
  },
  {
    id: 50, name: "Phở Chay", description: "Phở với nước dùng nấm thanh ngọt, đậu phụ và rau.",
    category: "Món Nước", time: ["Sáng", "Trưa"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "phở chay",
  },
  {
    id: 51, name: "Bún Riêu Chay", description: "Bún riêu từ cà chua và đậu phụ, thanh nhẹ dễ ăn.",
    category: "Món Nước", time: ["Sáng", "Trưa"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "bún riêu chay",
  },
  {
    id: 52, name: "Lẩu Nấm Chay", description: "Lẩu nấm đa dạng thanh đạm, hương vị tự nhiên.",
    category: "Lẩu", time: ["Tối"],
    budget: "over-100k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Mọi vùng", shopeeFoodKeyword: "lẩu nấm chay",
  },
  {
    id: 53, name: "Lẩu Gà Lá Giang", description: "Lẩu gà vị chua thanh từ lá giang, đặc sản miền Nam.",
    category: "Lẩu", time: ["Tối"],
    budget: "over-100k", dietary: ["no-red-meat", "no-seafood"], region: "Nam", shopeeFoodKeyword: "lẩu gà lá giang",
  },
  {
    id: 54, name: "Cơm Chiên Hải Sản", description: "Cơm chiên hải sản tươi ngon, thơm vị dầu hào.",
    category: "Món Cơm", time: ["Trưa", "Tối"],
    budget: "50k-100k", dietary: ["no-red-meat"], region: "Nam", shopeeFoodKeyword: "cơm chiên hải sản",
  },
  {
    id: 55, name: "Bánh Ít Trần", description: "Bánh nếp nhân đậu xanh dừa nạo, ngọt bùi.",
    category: "Ăn Vặt", time: ["Sáng", "Tối"],
    budget: "under-50k", dietary: ["chay", "no-red-meat", "no-seafood"], region: "Trung", shopeeFoodKeyword: "bánh ít trần",
  },
];
