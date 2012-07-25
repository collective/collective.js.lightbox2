(function($) {
	
	(function backportOnOff() {
		if ($.fn.on !== undefined) {
			return;
		}
		
		var cooked = [];
		
		$.fn.extend({
			on: function( types, selector, data, fn) {
				var origFn, type, matches, self = this, cookedOb;
	
				// Types can be a map of types/handlers
				if ( typeof types === "object" ) {
					// ( types-Object, selector, data )
					if ( typeof selector !== "string" ) { // && selector != null
						// ( types-Object, data )
						data = data || selector;
						selector = undefined;
					}
					for ( type in types ) {
						this.on( type, selector, data, types[ type ] );
					}
					return this;
				}
	
				if ( data == null && fn == null ) {
					// ( types, fn )
					fn = selector;
					data = selector = undefined;
				} else if ( fn == null ) {
					if ( typeof selector === "string" ) {
						// ( types, selector, fn )
						fn = data;
						data = undefined;
					} else {
						// ( types, data, fn )
						fn = data;
						data = selector;
						selector = undefined;
					}
				}
				if ( fn === false ) {
					fn = function() { return false; };
				} else if ( !fn ) {
					return this;
				}
				
				origFn = fn;
				
				fn = function(event) {
					var newEvent;
					matches = $(event.target).parentsUntil(self.selector || 'body', selector);
					
					if (matches.length) {
						newEvent = $.extend({}, event);
						newEvent.currentTarget = matches.get(0);
						return origFn(newEvent);
					} else {
						return true;
					}
				};
				
				$(cooked).each(function(index, ob) {
					if (ob.fn === origFn) {
						cookedOb = ob;
						return false;
					}
				});

				if (cookedOb===undefined) {
					cookedOb = {fn: origFn, cfns: []};
					cooked.push(cookedOb);
				}
				
				cookedOb.cfns.push(fn);
	
				return this.each( function() {
					jQuery.event.add( this, types, fn, data );
				});
			},
			off: function( types, selector, fn ) {
				var cookedFunctions = [], self=this;
				
				if ( types && types.preventDefault && types.handleObj ) {
					// ( event )  dispatched jQuery.Event
					var handleObj = types.handleObj;
					jQuery( types.delegateTarget ).off(
						handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
						handleObj.selector,
						handleObj.handler
					);
					return this;
				}
				if ( typeof types === "object" ) {
					// ( types-object [, selector] )
					for ( var type in types ) {
						this.off( type, selector, types[ type ] );
					}
					return this;
				}
				if ( selector === false || typeof selector === "function" ) {
					// ( types [, fn] )
					fn = selector;
					selector = undefined;
				}
				if ( fn === false ) {
					fn = returnFalse;
				}
				
				$(cooked).each(function(index, ob) {
					if (ob.fn === fn) {
						cookedFunctions = ob.cfns;
						return false;
					}
				});
				
				return this.each(function() {
					$(cookedFunctions).each(function(index, fn) {
						jQuery.event.remove( self, types, fn, selector );
					});
				});
			}
		});
	})();
	
	(function backportProp() {
		if ($.fn.prop !== undefined) {
			return;
		}
		
		$.extend({
			propFix: {
				tabindex: "tabIndex",
				readonly: "readOnly",
				"for": "htmlFor",
				"class": "className",
				maxlength: "maxLength",
				cellspacing: "cellSpacing",
				cellpadding: "cellPadding",
				rowspan: "rowSpan",
				colspan: "colSpan",
				usemap: "useMap",
				frameborder: "frameBorder",
				contenteditable: "contentEditable"
			},
		
			prop: function( elem, name, value ) {
				var ret, hooks, notxml,
					nType = elem.nodeType;
		
				// don't get/set properties on text, comment and attribute nodes
				if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
					return;
				}
		
				notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
		
				if ( notxml ) {
					// Fix name and attach hooks
					name = jQuery.propFix[ name ] || name;
					hooks = jQuery.propHooks[ name ];
				}
		
				if ( value !== undefined ) {
					if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
						return ret;
		
					} else {
						return ( elem[ name ] = value );
					}
		
				} else {
					if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
						return ret;
		
					} else {
						return elem[ name ];
					}
				}
			},
		
			propHooks: {
				tabIndex: {
					get: function( elem ) {
						// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
						// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
						var attributeNode = elem.getAttributeNode("tabindex");
		
						return attributeNode && attributeNode.specified ?
							parseInt( attributeNode.value, 10 ) :
							rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								undefined;
					}
				}
			}
		});
		
		$.fn.extend({
			prop: function( name, value ) {
				return $.access( this, $.prop, name, value, arguments.length > 1 );
			}
		});
	})();
})(jQuery);