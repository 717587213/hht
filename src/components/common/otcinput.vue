<template>
    <div class="clearfix" :class="{disabled: property.disabled}">
      <div class="payicon" v-if="iconUrl"><i class="iconUrl"> <img :src="iconUrl" alt=""> </i></div>
        <div class="input">
            <input 
                   :type='otcType'
                   :disabled = "property.disabled"
                   :placeholder="inpplaceholader || null"
                   v-model="currentValue"
                   @input="handle($event.target.value)"
            ref="input">
            <div class="selects" v-if="currency">
           <span>{{currency}}</span>
        </div>
        <div :class="{select:isactive}" v-else>
          <b class="yes"></b>
        </div>
        </div>      
    </div>
</template>
<script>
 export default {
   name: 'otcinput',
   props: {
     otcType: {
       type: String,
       default: '' || 'text'
     },
     iconUrl: {
       type: String,
       default: ''
     },
     currency: {
       type: String,
       default: ''
     },
     value: {
       type: String,
       default: ''
     },
     property: {
       default: ''
     },
     inpplaceholader: {
       default: ''

     }
   },
   watch: {
     currentValue (val) {
       if (val) {
         this.isactive = true
       } else {
         this.isactive = false
       }
     },
     value (val) {
       this.currentValue = val
       // if (this.otcType === 'number') {
       //   this.currentValue = Number(val)
       // } else {
       //   this.currentValue = val
       // }
     }
   },
   data () {
     return {
       isactive: false,
       currentValue: this.value
     }
   },
   computed: {
     // currentValue: {
     //   get () {
     //     return this.value
     //   },
     //   set (val) {
     //     this.$emit('input', val)
     //     if (val) {
     //       this.isactive = true
     //     } else {
     //       this.isactive = false
     //     }
     //   }
     // }
   },
   methods: {
     handle (data) {
       let obj = {
         name: this.property.name,
         value: data
       }
       this.$emit('input', data, obj)
     },
     addactive () {
       this.isactive = true
     },
     otcblur () {
       this.isactive = false
     }

   }
}
</script>
<style scoped lang="stylus">
// .otc-inp{
//     .payicon{
//           width:18px;
//           height:18px;
//           border-radius:50%;
//           margin:8px 7px;
//           float:left;
//     }
//     width:100%;
//     height:34px;
//     line-height:34px;
//     .input{
//         float:left;
//         width:95%;
//         input{
//             border:0;
//             height:34px;
//         }
//     }
//     .select{
//         float:left;
//         display:inline-block;
//         width:18px;
//         height:18px;
//         background:red;
//         border-radius:50%;
//         margin:8px 10px;
//         position:relative;
//              .yes{
//                  position:absolute;
//                  width:6px;
//                  height:10px;
//                  border-bottom: 1px solid;
//                  color:#fff;
//                  border-right: 1px solid;
//                  left: 50%;
//                  top: 50%;
//                  transform-origin: center;
//                  transform: translate(-50%, -60%) rotate(45deg);                
//                 }
//             }
// }
</style>
