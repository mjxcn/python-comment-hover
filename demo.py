def first():
    # 甲函数的局部变量：苹果数量。
    count = 1
    return count


def second():
    # 乙函数的局部变量：订单数量。
    count = 2
    return count


class User:
    # 用户的名称。
    name = "Alice"

    # 保存用户信息。
    def save(self):
        return self.name


class Order:
    # 订单的名称。
    name = "Order-01"

    # 保存订单信息。
    def save(self):
        return self.name


user = User()
order = Order()
user.save()
order.save()
print(user.name, order.name)
