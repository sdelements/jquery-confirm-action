# jQuery Confirm Action

![screenshot](screenshot.png)

## Simple Usage

```javascript
$('.my-button').confirmAction({
    title: {
        text: 'Whoa!'
    },
    message: {
        html: 'You are about to do a bad thing, are you sure?'
    }
});
```

## Advanced Usage with HTML and Custom Actions

```javascript
$('.my-button').confirmAction({
    title: {
        html: [
            '<i class="fa fa-warning"></i><br />',
            'Stop right there!'
        ].join('\n'),
        style: 'danger'
    },
    message: {
        html: 'You are about <strong>delete the internet</strong>, are you sure?'
    },
    actions: {
        confirm: {
            text: 'Go Ahead',
            callback: function(confirm, cancel) {
                confirm();
            }
        }
    }
});
```
