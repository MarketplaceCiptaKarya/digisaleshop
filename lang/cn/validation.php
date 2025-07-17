<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | 以下语言行包含验证器类使用的默认错误消息。
    | 某些规则有多个版本，例如大小规则。
    | 您可以自由修改这些消息。
    |
    */

    'accepted' => ':attribute 必须被接受。',
    'accepted_if' => '当 :other 为 :value 时，:attribute 必须被接受。',
    'active_url' => ':attribute 必须是有效的 URL。',
    'after' => ':attribute 必须是 :date 之后的日期。',
    'after_or_equal' => ':attribute 必须是等于或晚于 :date 的日期。',
    'alpha' => ':attribute 只能包含字母。',
    'alpha_dash' => ':attribute 只能包含字母、数字、破折号和下划线。',
    'alpha_num' => ':attribute 只能包含字母和数字。',
    'array' => ':attribute 必须是数组。',
    'before' => ':attribute 必须是 :date 之前的日期。',
    'before_or_equal' => ':attribute 必须是等于或早于 :date 的日期。',
    'between' => [
        'array' => ':attribute 的项目数必须在 :min 和 :max 之间。',
        'file' => ':attribute 的大小必须在 :min 和 :max KB之间。',
        'numeric' => ':attribute 必须在 :min 和 :max 之间。',
        'string' => ':attribute 的长度必须在 :min 和 :max 字符之间。',
    ],
    'boolean' => ':attribute 字段必须为 true 或 false。',
    'confirmed' => ':attribute 确认不匹配。',
    'date' => ':attribute 必须是有效的日期。',
    'date_equals' => ':attribute 必须是等于 :date 的日期。',
    'date_format' => ':attribute 的格式必须为 :format。',
    'different' => ':attribute 和 :other 必须不同。',
    'digits' => ':attribute 必须是 :digits 位数字。',
    'digits_between' => ':attribute 必须在 :min 和 :max 位数字之间。',
    'email' => ':attribute 必须是有效的电子邮件地址。',
    'exists' => '选定的 :attribute 无效。',
    'file' => ':attribute 必须是文件。',
    'filled' => ':attribute 字段必须有值。',
    'gt' => [
        'array' => ':attribute 必须有超过 :value 项。',
        'file' => ':attribute 必须大于 :value KB。',
        'numeric' => ':attribute 必须大于 :value。',
        'string' => ':attribute 必须大于 :value 字符。',
    ],
    'gte' => [
        'array' => ':attribute 必须有 :value 项或更多。',
        'file' => ':attribute 必须大于或等于 :value KB。',
        'numeric' => ':attribute 必须大于或等于 :value。',
        'string' => ':attribute 必须大于或等于 :value 字符。',
    ],
    'image' => ':attribute 必须是图片。',
    'in' => '选定的 :attribute 无效。',
    'integer' => ':attribute 必须是整数。',
    'ip' => ':attribute 必须是有效的 IP 地址。',
    'ipv4' => ':attribute 必须是有效的 IPv4 地址。',
    'ipv6' => ':attribute 必须是有效的 IPv6 地址。',
    'json' => ':attribute 必须是有效的 JSON 字符串。',
    'max' => [
        'array' => ':attribute 的项目数不得超过 :max。',
        'file' => ':attribute 的大小不得超过 :max KB。',
        'numeric' => ':attribute 不得大于 :max。',
        'string' => ':attribute 的长度不得超过 :max 字符。',
    ],
    'min' => [
        'array' => ':attribute 的项目数不得少于 :min。',
        'file' => ':attribute 的大小不得小于 :min KB。',
        'numeric' => ':attribute 不得小于 :min。',
        'string' => ':attribute 的长度不得少于 :min 字符。',
    ],
    'not_in' => '选定的 :attribute 无效。',
    'numeric' => ':attribute 必须是数字。',
    'required' => ':attribute 字段是必填的。',
    'same' => ':attribute 和 :other 必须匹配。',
    'size' => [
        'array' => ':attribute 必须包含 :size 项。',
        'file' => ':attribute 的大小必须为 :size KB。',
        'numeric' => ':attribute 必须为 :size。',
        'string' => ':attribute 的长度必须为 :size 字符。',
    ],
    'string' => ':attribute 必须是字符串。',
    'timezone' => ':attribute 必须是有效的时区。',
    'unique' => ':attribute 已经被占用。',
    'url' => ':attribute 必须是有效的 URL。',
    'uuid' => ':attribute 必须是有效的 UUID。',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | 在这里您可以为属性指定自定义验证消息，
    | 使用 "attribute.rule" 的约定来命名行。
    | 这使得为特定属性规则指定特定的自定义语言行变得快速。
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => '自定义消息',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | 以下语言行用于将我们的属性占位符替换为更易读的内容，
    | 例如将 "email" 替换为 "电子邮件地址"。
    | 这只是帮助我们使消息更具表现力。
    |
    */

    'attributes' => [
        'contact' => '联系方式',

        'shipping.first_name' => '收货人名字',
        'shipping.last_name' => '收货人姓氏',
        'shipping.address' => '收货地址',
        'shipping.detail_address' => '收货详细地址',
        'shipping.city' => '收货城市',
        'shipping.province' => '收货省份',
        'shipping.postal_code' => '收货邮政编码',
        'shipping.country' => '收货国家',

        'billing.first_name' => '账单人名字',
        'billing.last_name' => '账单人姓氏',
        'billing.address' => '账单地址',
        'billing.detail_address' => '账单详细地址',
        'billing.city' => '账单城市',
        'billing.province' => '账单省份',
        'billing.postal_code' => '账单邮政编码',
        'billing.country' => '账单国家',

        'save_shipping' => '保存送货偏好',
    ],

];
