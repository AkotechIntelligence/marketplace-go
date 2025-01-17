// src/public/js/edit-product.js
document.getElementById('files').addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const div = document.createElement('div');
            div.className = 'product-image-item';
            div.innerHTML = `
                <img src="${event.target.result}" 
                     style="width: 150px; height: 150px; object-fit: cover;" 
                     class="img-thumbnail">
            `;
            preview.appendChild(div);
        }
        reader.readAsDataURL(file);
    });

    // Update file input label
    const fileCount = e.target.files.length;
    const label = this.nextElementSibling;
    label.textContent = fileCount > 1 ? `${fileCount} files selected` : e.target.files[0].name;
});

// Handle category change
document.getElementById('categoryUuid').addEventListener('change', async function(e) {
    const categoryId = e.target.value;
    const subCategorySelect = document.getElementById('subCategoryUuid');
    
    if (!categoryId) {
        subCategorySelect.disabled = true;
        subCategorySelect.innerHTML = '<option value="">Select a category first</option>';
        return;
    }

    try {
        const response = await fetch(`/api/product/subcategories/${categoryId}`);
        const data = await response.json();
        
        subCategorySelect.innerHTML = '<option value="">Select a sub category</option>';
        data.data.forEach(subCat => {
            const selected = subCat.uuid === '<%= product.subCategoryUuid %>' ? 'selected' : '';
            subCategorySelect.innerHTML += `
                <option value="${subCat.uuid}" ${selected}>${subCat.name}</option>
            `;
        });
        subCategorySelect.disabled = false;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        alert('Error loading subcategories');
    }
});

// Load subcategories on page load
window.addEventListener('load', function() {
    const categorySelect = document.getElementById('categoryUuid');
    if (categorySelect.value) {
        categorySelect.dispatchEvent(new Event('change'));
    }
});

async function deleteProductImage(imageId) {
    if (confirm('Are you sure you want to remove this image?')) {
        try {
            const response = await fetch(`/api/merchant/products/images/${imageId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message || 'Error removing image');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error removing image');
        }
    }
}

function fetchSubcategories() {
    const categoryUuid = document.getElementById('categoryUuid').value;
    const subCategorySelect = document.getElementById('subCategoryUuid');

    // Clear existing subcategories
    subCategorySelect.innerHTML = '<option value="">Select a subcategory</option>';

    if (categoryUuid) {
        fetch(`/api/product/subcategories/${categoryUuid}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    data.data.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory.uuid;
                        option.textContent = subcategory.name;
                        subCategorySelect.appendChild(option);
                    });
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching subcategories:', error);
            });
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('categoryUuid');
    if (categorySelect) {
        categorySelect.addEventListener('change', fetchSubcategories);
    }
});
 










 