var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) {
  return (a.raw = a);
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, d) {
  a.raw = d;
  return a;
};
$jscomp.arrayIteratorImpl = function (a) {
  var d = 0;
  return function () {
    return d < a.length ? { done: !1, value: a[d++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
  var d = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return d ? d.call(a) : $jscomp.arrayIterator(a);
};
(function analyzeProductItems() {
  function countProductItems(b) {
    b.forEach(function (c) {
      c.product_items &&
        c.product_items.forEach(function (e) {
          f[e.model_name] ? f[e.model_name]++ : (f[e.model_name] = 1);
        });
    });
  }
  function displayResults() {
    var sortedResults = Object.fromEntries(
      Object.entries(f).sort(function (c, e) {
        var g = $jscomp.makeIterator(c);
        g.next();
        g = g.next().value;
        var m = $jscomp.makeIterator(e);
        m.next();
        return m.next().value - g;
      })
    );
    console.info("Đã hoàn tất. Kết quả:");
    console.table(sortedResults);
  }
  function fetchRatings() {
    var url =
      "https://shopee.vn/api/v2/item/get_ratings?filter=0&flag=1&itemid=" +
      k +
      "&limit=50&offset=" +
      p +
      "&shopid=" +
      l +
      "&type=0";
    console.log("Đang quét trang " + h + "...");
    fetch(url, {
      headers: {
        "x-api-source": "pc",
        "x-requested-with": "XMLHttpRequest",
        "x-shopee-language": "vi",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.error || !data.data || data.data.ratings == null || data.data.ratings.length == 0) {
          if (h > 1) {
            displayResults();
          }
        } else {
          countProductItems(data.data.ratings);
          if (h < 50) {
            p += 50;
            h++;
            fetchRatings();
          } else {
            displayResults();
          }
        }
      });
  }
  var f = {},
    p = 0,
    h = 1,
    l = null,
    k = null;
  console.info(
    "Hiếu Minh - iZuminnnn"
  );
  (function () {
    var url = new URL(window.top.location.href);
    if (!url.hostname.includes("shopee.vn"))
      throw Error(
        "\u0110o\u1ea1n m\u00e3 n\u00e0y ch\u1ec9 c\u00f3 th\u1ec3 s\u1eed d\u1ee5ng tr\u00ean web Shopee.vn"
      );
    var match = /.+-i\.([0-9]+).([0-9]+)/.exec(url.pathname);
    if (match) {
      l = match[1];
      k = match[2];
    } else {
      throw Error(
        "Trang bạn đang xem không phải là một trang sản phẩm của Shopee."
      );
    }
  })();
  console.info(
    "Bắt đầu phân tích với Shop ID " +
      l +
      " và mã sản phẩm " +
      k +
      "..."
  );
  fetchRatings();
})();
