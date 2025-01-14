function deleteShop(shopId) {
    if (confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
        fetch(`/api/merchant/shops/${shopId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message || 'Error deleting shop');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting shop');
        });
    }
}

function initializeShopCards() {
    // Add hover effects and animations
    const shopCards = document.querySelectorAll('.shop-card');
    shopCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeShopCards);