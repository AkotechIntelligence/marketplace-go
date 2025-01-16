// Orders page functionality
$(document).ready(function() {
    // Initialize DataTable with export buttons
    const ordersTable = $('#ordersTable').DataTable({
        order: [[1, 'desc']], // Sort by date descending
        pageLength: 25,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="fas fa-file-csv"></i> CSV',
                className: 'btn btn-outline-secondary btn-sm'
            },
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                className: 'btn btn-outline-secondary btn-sm'
            },
            {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                className: 'btn btn-outline-secondary btn-sm'
            }
        ],
        responsive: true
    });

    // Date range picker initialization
    $('#dateRange').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(29, 'days'),
        endDate: moment()
    }, function(start, end) {
        // Apply date filter to DataTable
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                const date = moment(data[1]);
                return date.isBetween(start, end, 'day', '[]');
            }
        );
        ordersTable.draw();
    });

    // Status filter
    $('#orderStatus').on('change', function() {
        ordersTable
            .column(4)
            .search(this.value)
            .draw();
    });

    // Reset filters
    $('#resetFilters').on('click', function() {
        $('#orderStatus').val('');
        $('#dateRange').val('');
        ordersTable
            .search('')
            .columns().search('')
            .draw();
    });
});

// Order details modal
function showOrderDetails(orderId) {
    $.get(`/api/merchant/orders/${orderId}`, function(response) {
        if (response.success) {
            const order = response.order;
            $('#orderDetailsContent').html(order);
            $('#orderDetailsModal').modal('show');
        }
    });
}

// Update order status
function updateOrderStatus(orderId) {
    Swal.fire({
        title: 'Update Order Status',
        input: 'select',
        inputOptions: {
            'pending': 'Pending',
            'processing': 'Processing',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        },
        inputPlaceholder: 'Select status',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `/api/merchant/orders/${orderId}/status`,
                method: 'PUT',
                data: JSON.stringify({ status: result.value }),
                contentType: 'application/json',
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Success', 'Order status updated', 'success')
                            .then(() => window.location.reload());
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Failed to update order status', 'error');
                }
            });
        }
    });
}