document.addEventListener('DOMContentLoaded', function() {
    // Initialize Alpine.js data
    window.settingsForm = function() {
        return {
            settlementMethod: 'bank',
            loading: false,
            async handleSubmit(event) {
                event.preventDefault();
                this.loading = true;

                try {
                    const formData = new FormData(event.target);
                    const response = await fetch('/merchant/settings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(Object.fromEntries(formData))
                    });

                    const data = await response.json();

                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Settings updated successfully',
                            confirmButtonColor: '#3085d6'
                        });
                    } else {
                        throw new Error(data.message || 'Failed to update settings');
                    }
                } catch (error) {
                    console.error('Settings update error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message || 'Failed to update settings',
                        confirmButtonColor: '#d33'
                    });
                } finally {
                    this.loading = false;
                }
            }
        }
    }

    // Initialize any other components or event listeners
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            this.style.color = this.value ? '#2c3e50' : '#6c757d';
        });
    });
});