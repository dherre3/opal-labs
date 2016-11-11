angular.module('myApp').directive('hcChart', function () {
        var chart = null;
        var activeIndex = 0;
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        options: '=',
                        activeIndex:'='
                    },
                    link: function (scope, element) {
                        element.css({'min-width':'310px','width':'100%','padding':'0','margin':'0'});
                        //Highcharts.chart(element[0], scope.options);
                        Highcharts.chart(element[0], scope.options);
                        scope.$watch('options',function()
                        {
                            
                                chart = new Highcharts.chart(element[0], scope.options,function(chart)
                                {
                                    chart.series[0].data[scope.activeIndex].setState('hover');
                                    //chart.series[0].data[1].setState('hover');
                                    chart.tooltip.refresh(chart.series[0].points[scope.activeIndex]);
                                });
                            
                            

                        });
                        ons.orientation.on('change',function()
                        {
                            console.log('asda');
                            if(chart)
                            {
                                chart.containerHeight = chart.options.chart.height;
                                chart.containerWidth = document.documentElement.clientWidth;
                                chart.setSize(chart.containerWidth, chart.containerHeight, false);
                                chart.hasUserSize = null;
                                console.log('heelo');
                                chart.series[0].data[scope.activeIndex].setState('hover');
                                //chart.series[0].data[1].setState('hover');
                                chart.tooltip.refresh(chart.series[0].points[scope.activeIndex]);
                            }
                        });
                        scope.$watch('activeIndex',function(after,before)
                        {
                            console.log(before,after);
                            if(chart)
                            {
                                // if(before!==after)
                                // {
                                //     chart.series[0].data[before].setState();
                                //     chart.tooltip.hide();
                                // }
                                // console.log('heelo');
                                chart.series[0].data[after].setState('hover');
                                //chart.series[0].data[1].setState('hover');
                                chart.tooltip.refresh(chart.series[0].points[after]);
            
                            }
                        });
         
        
                    }
                };
            })
            // Directive for pie charts, pass in title and data only    
            .directive('hcPieChart', function () {
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        title: '@',
                        data: '='
                    },
                    link: function (scope, element) {
                        Highcharts.chart(element[0], {
                            chart: {
                                type: 'pie'
                            },
                            title: {
                                text: scope.title
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                    }
                                }
                            },
                            series: [{
                                data: scope.data
                            }]
                        });
                    }
                };
            })