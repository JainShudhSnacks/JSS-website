// Default illustrations never overwrite owner-uploaded product photos.
const illustratedProducts = new Set(["hand-sev","hand-papdi","plain-papdi","sweet-mixture","spicy-mixture","spicy-nukti","gathiya","burhanpuri-gathiya","mogar","chana-dal","chana-dal-dhaniya","masoor","soya-sticks","pepper-banana-chips","chilli-banana-chips","mint-banana-chips","tomato-banana-chips","sweet-banana-mixture","spicy-banana-mixture","pepper-peanuts","chilli-peanuts","sendha-peanuts","mangodi","atta-chakli","sweet-khurme","shakkar-para","mini-samosa","mini-kachori","tasty-peanuts","cashew-biscuits","sweet-atta-biscuits","jeera-atta-biscuits","ajwain-atta-biscuits","dry-fruit-biscuits","atta-toast","cream-roll","pav","atta-bread","pizza-base","atta-cupcake","moong-papad","chana-papad","plain-khakhra","jeeravan-khakhra","ajwain-khakhra","salt","chilli","coriander","turmeric","maida","rava","thuli"]);

export function productArtwork(product) {
 const custom = typeof product?.image === 'string' ? product.image.trim() : '';
 if (custom) return { src: custom, illustrative: !!product.imageIllustrative };
 const src = illustratedProducts.has(product?.id) ? `/images/products/${product.id}.webp` : '';
 return { src, illustrative: true };
}
